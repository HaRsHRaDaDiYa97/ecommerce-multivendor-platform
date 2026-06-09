from django.urls import path
from .views import *

urlpatterns = [
    path("send/", ContactMessageCreateAPIView.as_view()),
    path("", ContactMessageListAPIView.as_view()),
    path("reply/<int:pk>/", ContactMessageReplyAPIView.as_view()),
    path("delete/<int:pk>/", ContactMessageDeleteAPIView.as_view()),
]
