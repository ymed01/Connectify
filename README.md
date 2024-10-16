
# Connectify





## Description

A Group video calling application using the Agora Web SDK with a Django backend.

## How to use this source code

#### 1 - Clone repo

```bash
git clone https://github.com/ymed01/Connectify.git
```

#### 2 - Install requirements

```bash
cd Connectify
pip install -r requirements.txt
```

#### 3 - Update Agora credentals

In order to use this project you will need to replace the agora credentials in `views.py` and `script.js`.

Create an account at agora.io and create an `app`. Once you create your app, you will want to copy the `appid` & `appCertificate` to update `views.py` and `script.js`

###### views.py

```bash

def getToken(request):
    appId = "YOUR APP ID"
    appCertificate = "YOUR APPS CERTIFICATE"
    ......
```

###### script.js

```bash

....
const APP_ID = 'YOUR APP ID'
....
```

#### 4 - Start server

```bash
python manage.py runserver  
```
