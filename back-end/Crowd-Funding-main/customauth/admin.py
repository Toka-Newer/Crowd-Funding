from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


# Register your models here.

UserAdmin.fieldsets += (
    ('Extra Fields', {'fields': ('phone','picture','email_verification_code' )}),
    )

admin.site.register(User, UserAdmin)

