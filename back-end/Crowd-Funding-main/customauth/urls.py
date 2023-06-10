from django.urls import path,include
from .views import register,login,verifiy_email

urlpatterns = [
    path("register", register),
    path("login", login),
    path("verifiy-email/<str:email>/<str:code>", verifiy_email),
]