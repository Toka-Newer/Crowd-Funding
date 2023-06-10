
from .models import Project,Rate,Report

from django.db.models.signals import post_save
from django.dispatch import receiver


# @receiver(post_save, sender=Report)
# def check_if_is_accpted_report(sender, instance, created, **kwargs):
#     if not created:
#     # if instance.is_accepted ==False:
#         instance.is_accepted==True
#         print("asdadsad  ",instance)
#         # instance.save()
