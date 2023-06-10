# from rest_framework.decorators import api_view,authentication_classes,permission_classes
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound,APIException
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated,IsAdminUser
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from django.db.models import Q


from .models import *
from .serializers import *

from django.shortcuts import render
def home(request):
    return render(request,'api/home.html') 

class Home(APIView):    
    """
    ######################  Home Page #####################################
    
    1- A slider to show the highest five rated running projects to encourage
        users to donate
    2- List of the latest 5 projects
    3- List of latest 5 featured projects (which are selected by the admin)
    4- A list of the categories. User can open each category to view its
        projects
    5- Search bar that enables users to search projects by title or tag
    """
    
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self,request):
        '''
        By default, the result is sorted ascending (the lowest value first),
        to change the direction to descending (the highest value first),
        use the minus sign (NOT), - in front of the field average_rating:
        '''
        # the highest five rated
        slider=Project.objects.filter(is_available=True).order_by('-average_rating')[0:5]
        serializer_slider=HomeSerializer(slider,many=True)
        
        # List of the latest 5 projects
        latest=Project.objects.filter(is_available=True).order_by('-created_at')[0:5]
        serializer_latest=HomeSerializer(latest,many=True)
        
        # List of latest 5 featured projects (which are selected by the admin)
        featured=Project.objects.filter(is_featured=True)[0:5]
        serializer_featured=HomeSerializer(featured,many=True)
        
        # A list of the categories
        categories=Category.objects.all()
        serializer_category=CategorySerializer(categories,many=True)
        
        
        return Response(
            {
                "slider":serializer_slider.data,
                "latest":serializer_latest.data,
                "featured":serializer_featured.data,
                "categories":serializer_category.data,
                }
            )
        
class Search(APIView):
    def get(self,request):
        #  5- Search bar that enables users to search projects by title or tag
        value=self.request.query_params.get('value')
        if not value:
            return Response({"error":"pleasr provide a title or tag for search value"},status=status.HTTP_400_BAD_REQUEST)    
                
        search=Project.objects.filter(Q(tags__name__icontains=value)|Q(title__icontains=value)).distinct().order_by('-average_rating')
        serializer_search=HomeSerializer(search,many=True)
            
        return Response(
                {
                    "search":serializer_search.data,
                    }
                )
        
        
        
class CategoryList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self,request):
        #  get all categories for create project form         
        categories=Category.objects.all()
        serializer_categories=CategorySerializer(categories,many=True)
            
        return Response(
                {
                    "categories":serializer_categories.data,
                    }
                )
        
class TagList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self,request):
        #  get all tags for create project form         
        tags=Tag.objects.all()
        serializer_tags=TagSerializer(tags,many=True)
            
        return Response(
                {
                    "tags":serializer_tags.data,
                    }
                )

class ProjectList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get(self, request):
        projects = Project.objects.filter(is_available=True)
        # print(list(projects))
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(queryset=projects, request=request)
        serializer = HomeSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self,request):
        
        # set user in request data from token 
        # request.data['user']=request.user.id
        data = request.data.copy()
        data['user'] = request.user.id
        # creation serializer
        serializer = ProjectSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        project=serializer.save()
        # view serializer
        project=HomeSerializer(project)
        return Response(project.data,status=status.HTTP_201_CREATED)
    
class ProjectDetail(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self,request,id):
        try:
            project=get_object_or_404(Project,id=id)
            serializer_project=HomeSerializer(project)
            
            # get 4 similar projects based in project tag
            similar_projects = Project.objects.filter(tags__in=project.tags.all()).exclude(id=project.id).distinct()[:4]
            serializer_similar_projects=HomeSerializer(similar_projects,many=True)
            
            return Response({"project":serializer_project.data,"similar_projects":serializer_similar_projects.data},status=status.HTTP_200_OK)
        except Http404:
            return Response({'message':'project not found'},status=status.HTTP_404_NOT_FOUND)
    
    def put(self,request,id):
        """
        Project creator can cancel the project if the donations are less than
        25% of the target
        """
        try:
            project=get_object_or_404(Project,id=id)
            if request.user.id != project.user.id:
                return Response({'message':"you didn't create this project"},status=status.HTTP_400_BAD_REQUEST)
            
            if not project.is_available:
                return Response({'message':"project already canceled or reported"},status=status.HTTP_400_BAD_REQUEST)
                    
            parcent=(project.current_donations/project.target_donations)*100
            if parcent < 25:
                project.is_available=False
                project.save()
                serializer_project=HomeSerializer(project)  
                return Response({"project":serializer_project.data},status=status.HTTP_200_OK)
            return Response({'message':"project donations has more than 25% of the target donations "},status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            return Response({'message':'project not found'},status=status.HTTP_404_NOT_FOUND)



class CommentList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        # set user in request data from token 
        # request.data['user']=request.user.id
        data = request.data.copy()
        data['user'] = request.user.id
        # create comment serializer
        serializer = CreateCommentSerializer(data=data)
        if serializer.is_valid():
            comment=serializer.save()
            #  retrive comment serializer
            serializer=CommentSerializer(comment)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        
class DonationtList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        # set user in request data from token 
        # request.data['user']=request.user.id
        if int(request.data['amount'])<=0:
            return Response({"message":"amount shoud be greater than zero!"},status=status.HTTP_400_BAD_REQUEST)
            
        data = request.data.copy()
        data['user'] = request.user.id
        # create donation serializer
        serializer = CreateDonationsSerializer(data=data)
        if serializer.is_valid():
            donation=serializer.save()
            #  retrive donation serializer
            serializer=DonationsSerializer(donation)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
class RateList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        # set user in request data from token 
        # request.data['user']=request.user.id
        data = request.data.copy()
        data['user'] = request.user.id
        # create rate serializer
        serializer = RateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class RateDetails(APIView):  
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self,request,id):
        try:
            rate=get_object_or_404(Rate,id=id)
            
            if request.user.id != rate.user.id:
                return Response({'message':"you didn't create this rate"},status=status.HTTP_400_BAD_REQUEST)
            data = request.data.copy()
            data['user'] = request.user.id
            serializer=RateSerializer(rate,data=data)
            
            if serializer.is_valid():
                serializer.update(rate,serializer.validated_data)
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        except Http404:
            return Response({'message':'rate not found'},status=status.HTTP_404_NOT_FOUND)
        
class ReportList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        # set user in request data from token 
    
        data = request.data.copy()
        data['user'] = request.user.id
        comment=data.get('comment',None) 
        project=data.get('project',None)
        
        if  project is None and comment is None:
            return Response(
                {
                    "message":"you must provide a comment or project for this report"
                    },
                status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ReportSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class Profile(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        print(self.request.path) 
        serializer=ProfileSerializer(request.user)
        return Response(serializer.data,status=status.HTTP_201_CREATED)

    def put(self,request):
        # user=User.objects.get(id=request.user.id)
        serializer=ProfileSerializer(request.user,self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    # delete user 
    def delete(self,request):
        user=User.objects.get(id=request.user.id)
        data = request.data.copy()
        # email=data.get('email',None) 
        password=data.get('password',None)
        if user.check_password(password):
            user.delete()
            return Response({'message':"Your account has been deleted"},status=status.HTTP_200_OK)
        return Response({'message':"Incorrect password"},status=status.HTTP_400_BAD_REQUEST)
        

class UserProjects(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get(self, request,id):
        print(id)
        user=User.objects.get(id=request.user.id)
        
        # projects = user.projects.all()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(queryset=user.projects.all(), request=request)
        serializer = HomeSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
class UserDonations(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get(self, request,id):
        print(id)
        user=User.objects.get(id=request.user.id)
        
        # projects = user.projects.all()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(queryset=user.donations.all(), request=request)
        serializer = DonationsSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)