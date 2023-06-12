from django.urls import path,include
from .views import *




urlpatterns = [
    path("template", home),
    path("home", Home.as_view()),
    path("search", Search.as_view()),
    path("categories", CategoryList.as_view()),
    path("tags", TagList.as_view()),
    path("projects", ProjectList.as_view()),
    path("projects/<int:id>", ProjectDetail.as_view()),
    path("comments", CommentList.as_view()),
    path("donations", DonationtList.as_view()),
    path("rates", RateList.as_view()),
    path("rates/<int:id>", RateDetails.as_view()),
    path("reports", ReportList.as_view()),
    path("profile", Profile.as_view()),
    path("profile/<int:id>/projects", UserProjects.as_view()),
    path("profile/<int:id>/donations", UserDonations.as_view()),
]