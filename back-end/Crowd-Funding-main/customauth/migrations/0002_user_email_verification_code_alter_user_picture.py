# Generated by Django 4.2.1 on 2023-05-23 20:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customauth', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='email_verification_code',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='user',
            name='picture',
            field=models.ImageField(blank=True, default='./default/user.png', upload_to='picture/'),
        ),
    ]