# Generated by Django 5.1.1 on 2024-10-20 12:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AgoraCredentials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app_id', models.CharField(max_length=255)),
                ('app_certificate', models.CharField(max_length=255)),
            ],
        ),
    ]
