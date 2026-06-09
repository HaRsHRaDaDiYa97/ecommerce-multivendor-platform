from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, TagViewSet

# -------------------------
# DRF Router
# -------------------------
router = DefaultRouter()
router.register(r'items', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')  # 🔥 NEW

# -------------------------
# URL Patterns
# -------------------------
urlpatterns = [
    path('', include(router.urls)),
]