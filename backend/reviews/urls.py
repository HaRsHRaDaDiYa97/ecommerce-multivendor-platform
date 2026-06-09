# reviews/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet

router = DefaultRouter()
router.register(r'items', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]