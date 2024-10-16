const APP_ID = 'YOUR APP ID'
const CHANNEL = sessionStorage.getItem('room')
const TOKEN = sessionStorage.getItem('token')
let UID = Number(sessionStorage.getItem('UID'))

let NAME = sessionStorage.getItem('name')

const client = AgoraRTC.createClient({mode:'rtc' , codec : 'vp8'})

let localTracks = []
let remoteUser = {}

let joinAndDisplayLocalStream = async () => {
    document.getElementById('room-name').innerText = CHANNEL
    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserleft)

    try {
        //https://api-ref.agora.io/en/video-sdk/web/4.x/interfaces/iagorartcclient.html#join
        //UID = await client.join(APP_ID, CHANNEL, TOKEN, null) //join channel
        await client.join(APP_ID, CHANNEL, TOKEN, UID)
    } catch (error) {
        console.error(error)
        window.open('/','_self')
    }

    
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks() //get audio and video tracks

    let member = await createMember()
   


    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                    <div class="video-player" id="user-${UID}"></div>
                </div>` //create a player

    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player) //append a player to video streams

    localTracks[1].play(`user-${UID}`) //play method

    //https://api-ref.agora.io/en/video-sdk/web/4.x/interfaces/iagorartcclient.html#publish
    await client.publish([localTracks[0],localTracks[1]]) //publish track

}

let handleUserJoined = async (user, mediaType) => {
    remoteUser[user.uid] = user
    await client.subscribe(user, mediaType)

    if(mediaType === 'video'){
        let player  = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove();
        }

        let member = await getMember(user)


        player = `<div class="video-container" id="user-container-${user.uid}">
                    <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                    <div class="video-player" id="user-${user.uid}"></div>
                </div>` //create a player

        document.getElementById('video-streams').insertAdjacentHTML('beforeend',player) //append a player to video streams
        
        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserleft = async (user) => {
    delete remoteUser[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove();
}

let leaveAndRemoveLocalStream = async () => {
    //leave the channel 
    //redirect the user to the lobby
    for (let i = 0; localTracks.length > i; i++){
        localTracks[i].stop() //stop will stop the track but we can technically open this track again or start it
        localTracks[i].close() //when we close the track that's it the only way to actually start this up again is to reopen a new track
    } 

    await client.leave()
    //This is somewhat of an issue because if user leaves without actaull pressing leave button, it will not trigger
    deleteMember()
    window.open('/' ,'_self')
}

let toggleCamera = async (e) => {
    if (localTracks[1].muted){ // true means camera is off 
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }
    else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
    
}

let toggleMicrophone = async (e) => {
    if (localTracks[0].muted){ // true means camera is off 
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }
    else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
    
}

let createMember = async () => {
    let response = await fetch('/create_member/',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({'name':NAME, 'room_name':CHANNEL, 'UID':UID})

    })

    let member = await response.json()
    return member
}

let getMember = async (user) => {
    let response = await fetch(`/get_member/?UID=${user.uid}&room_name=${CHANNEL}`)
    let member = await response.json()
    return member
}

let deleteMember = async () => {
    let response = await fetch('/delete_member/',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({'name':NAME, 'room_name':CHANNEL, 'UID':UID})

    })
    let member = await response.json()
}


window.addEventListener('beforeunload',deleteMember)


joinAndDisplayLocalStream()


document.getElementById('leave-btn').addEventListener('click',leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click',toggleCamera)
document.getElementById('mic-btn').addEventListener('click',toggleMicrophone)


