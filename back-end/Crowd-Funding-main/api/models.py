from django.db import models
from django.core.validators import  MaxValueValidator, MinValueValidator

from customauth.models import User

from datetime import datetime,timedelta,date

class Category(models.Model):
    name=models.CharField(max_length=50)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    

class Tag(models.Model):
    name=models.CharField(max_length=50)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name
    
def default_end_date():
    return (date.today() + timedelta(days=5)).isoformat()

class Project(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='projects')
    title=models.CharField(max_length=50)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    details=models.TextField()
    target_donations=models.IntegerField(default=0,validators=[MinValueValidator(0)])
    current_donations=models.IntegerField(default=0)
    tags=models.ManyToManyField(Tag)
    average_rating=models.FloatField(default=0)
    is_available=models.BooleanField(default=True)
    is_featured=models.BooleanField(default=False)
    start_date=models.DateField(default=date.today)
    end_date=models.DateField(default=date.today)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    #  called in rate save method
    def calculate_avg_rate(self):
        ratings=list(self.ratings.values_list('rate',flat=True))
        avg_rate=(sum(ratings)/len(ratings))
        self.average_rating=avg_rate
        self.save()
        


class Image(models.Model):
    url=models.ImageField(upload_to="picture/",blank=True,default="./default/user.png")
    project=models.ForeignKey(Project,on_delete=models.CASCADE,related_name='images')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.project.title
    
class Donation(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='donations')
    project=models.ForeignKey(Project,on_delete=models.CASCADE,related_name='donations')
    amount=models.IntegerField(
        default=0,
        validators=[
            # MaxValueValidator(Project.objects.get(id=project).target),
            MinValueValidator(0)
        ])
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self):
        return str(self.amount)
    
    def save(self,*args, **kwargs):
        '''
        re calculate current_donations of project when adding new donation 
        '''
        project=Project.objects.get(id=self.project.id)
        money_to_complete_the_target= (project.target_donations-project.current_donations)
        if self.amount> money_to_complete_the_target:
            self.amount=money_to_complete_the_target
        project.current_donations+=self.amount
            
        super().save(*args, **kwargs) 
        project.save()
        # ratings=list(project.ratings.values_list('rate',flat=True))
        # avg_rate=((sum(ratings)+self.rate)/(len(ratings)+1))
        # project.average_rating=avg_rate
    
class Comment(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    project=models.ForeignKey(Project,on_delete=models.CASCADE,related_name='comments')
    comment_message=models.CharField(max_length=60)
    is_available=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    
    def __str__(self):
        return self.comment_message
    
class Report(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    project=models.ForeignKey(Project,on_delete=models.CASCADE,blank=True,null=True)
    comment=models.ForeignKey(Comment,on_delete=models.CASCADE,blank=True,null=True)
    report_message=models.CharField(max_length=60)
    is_accepted=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.report_message


    def save(self,*args, **kwargs):
        '''
        set
            project.is_available to false
        OR 
            comment.is_available to false
        
        |*** if report accepted ***| 
        '''
        if self.is_accepted:
            if self.project:    
                project=Project.objects.get(id=self.project.id)
                project.is_available=False
                project.save()
            elif self.comment:
                comment=Comment.objects.get(id=self.comment.id)
                comment.is_available=False
                comment.save()   
                
        super().save(*args, **kwargs)    

class Rate(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    project=models.ForeignKey(Project,on_delete=models.CASCADE,related_name='ratings')
    rate=models.FloatField(
        default=0,
        validators=[
            MaxValueValidator(5),
            MinValueValidator(0)
        ])
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'project')
        
    def __str__(self):
        return str(self.rate)
    
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs) 
        self.project.calculate_avg_rate()

    # def save(self,*args, **kwargs):
    #     rate=Rate.objects.get(user=self.user,project=self.project)
    #     avg_rate=0
    #     if rate is None:
    #         project=Project.objects.get(id=self.project.id)
    #         avg_rate=((sum(ratings)+self.rate)/(len(ratings)+1))
    #     else:
    #         rate.rate=self.rate
    #         rate.save()
    #         project=Project.objects.get(id=self.project.id)
    #         ratings=list(project.ratings.values_list('rate',flat=True))
            
    #     '''
    #     calculate avg rating of project when adding new rating 
    #     '''
    #     project.average_rating=avg_rate
    #     super().save(*args, **kwargs) 
    #     project.save()
        
        


