from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

import random, string

# Create your models here.

class User(AbstractUser):
    
    email = models.EmailField(_("email address"), blank=False,unique=True)
    
    phone=models.CharField(max_length=11,
        validators=[RegexValidator(r'^01[0125][0-9]{8}$')])
    
    picture=models.ImageField(upload_to="picture/",blank=True,default="./default/user.png")
    email_verification_code=models.CharField(max_length=50,blank=True)
    
    # extra optional info
    birth_date=models.DateField(blank=True,null=True)
    facebook_profile=models.URLField(blank=True,null=True)
    counrty=models.CharField(max_length=50,blank=True,null=True)
    def genrate_verification_code(self):
        code = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
        self.email_verification_code=code
        self.save()
        return code
    
    def verifiy_email(self,code):
        if self.email_verification_code==code:
            self.is_active=True
            self.save()
            return True
        return False