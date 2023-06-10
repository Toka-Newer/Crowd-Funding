from rest_framework import serializers
from .models import *
import magic
from django.core.exceptions import ValidationError

class ImageSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    project = serializers.StringRelatedField()
    class Meta:
        model=Image
        fields = '__all__'  

class DonationsSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    project = serializers.StringRelatedField()
    user = serializers.StringRelatedField()
    class Meta:
        model=Donation
        fields = '__all__'  

class CreateDonationsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Donation
        fields = '__all__' 


class RateSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model=Rate
        fields = '__all__'
        
    def update(self, instance, validated_data):
        instance.rate = validated_data.get('rate', instance.rate)
        print(instance.rate)
        instance.save()
        return instance
        
class CategorySerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model=Category
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField(read_only=True)
    user = serializers.StringRelatedField()
    created_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model=Comment
        fields = '__all__'

class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Comment
        fields = '__all__'   
    def create(self, validated_data):
        # Remove the unwanted properties from the validated data
        validated_data.pop('is_available', None)
        # create comment
        instance = Comment.objects.create(**validated_data)

        return instance
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',"username", "first_name","last_name", "email",'picture',)

class HomeSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    category = serializers.StringRelatedField()
    donations = DonationsSerializer(many=True)
    tags = serializers.StringRelatedField(many=True)
    images = ImageSerializer(many=True)
    comments=CommentSerializer(many=True)
    created_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    
    class Meta:
        model=Project
        # fields='__all__'
        fields=(
            'id','title','user','details',
            'target_donations','current_donations','average_rating',
            'start_date','end_date','category',
            'is_featured','is_available',
            'tags','images','donations','comments'
            ,'created_at','updated_at',
            # ''
            )

class ReportSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    is_accepted=serializers.BooleanField(read_only=True)
    class Meta:
        model=Report
        fields = '__all__'
        

class TagSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    updated_at = serializers.DateTimeField(read_only=True,format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model=Tag
        fields = '__all__'
        

# used for creation
class ProjectSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child = serializers.FileField( allow_empty_file = False, use_url = False),
            write_only = True
    )
    class Meta:
        model=Project
        # fields = '__all__'
        fields=(
            'id','title','user','details',
            'target_donations','current_donations',
            'start_date','end_date','category',
            'tags','images',
            )
        
    def create(self, validated_data):
        # Remove the unwanted properties from the validated data
        validated_data.pop('current_donations', None)
        validated_data.pop('is_available', None)
        validated_data.pop('is_featured', None)
        validated_data.pop('average_rating', None)
        
        tags=validated_data.pop('tags', [])
        images= validated_data.pop('images')
        
        # create project
        instance = Project.objects.create(**validated_data)
        
        # set tags
        instance.tags.set(tags)
        
        for img in images:
            mime = magic.from_buffer(img.read(1024), mime=True)
            if not mime.startswith('image'):
                raise ValidationError({"errors":f"{img.name}File is not an image"})
            Image.objects.create(project=instance,url=img)

        return instance


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        exclude=[
            'password',
            'is_active',
            'is_superuser',
            'last_login',
            'is_staff',
            'email_verification_code',
            'groups',
            'user_permissions'
]
        extra_kwargs = {
            'id': {'read_only': True},
            'email': {'read_only': True},
            'username': {'read_only': True},
            'date_joined': {'read_only': True},
        }