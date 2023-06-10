from rest_framework.decorators import api_view,parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
# from rest_framework.views import APIView
# from rest_framework.parsers import JSONParser, MultiPartParser

# Create your views here.
from .models import User
from .serializers import RegisterSerializer,LoginSerializer,UserSerializer

import os
from dotenv import load_dotenv

load_dotenv()
@api_view([ 'POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user=serializer.save()
        user.email_user("subject",f"""hola from DRF
                        your email code is: {os.getenv('FRONT_END_URL')}/verifiy-email/{user.email}/{user.genrate_verification_code()}""")
        
        return Response(
            {
                "user":serializer.data,
                },
            status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user =serializer.validated_data['user']
    token ,created= Token.objects.get_or_create(user=user)
    # print(token,token.key,created)
    serializer=UserSerializer(user)
    return Response(
        {
            "user":serializer.data,
            "token":token.key
            },
        status=status.HTTP_200_OK)




@api_view(['POST'])
def verifiy_email(request,email,code):
    
    if not email and not code:
        return Response({"message":"email and code is requird"}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.get(email=email)
    
    if not user:
        return Response({"message":"there is no user created by this email"}, status=status.HTTP_400_BAD_REQUEST)
    
    if user.verifiy_email(code):
        token = Token.objects.create(user=user)
        serializer=UserSerializer(user)
        return Response({"user":serializer.data,"token":token.key,"message":"email verified successfully"},status=status.HTTP_200_OK)
    
    return Response({"message":"code not valid "}, status=status.HTTP_400_BAD_REQUEST)
    
