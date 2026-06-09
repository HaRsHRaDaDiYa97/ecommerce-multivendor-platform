# wishlist/urls.py
from django.urls import path
from .views import AddToWishlistView, RemoveFromWishlistView, WishlistView

urlpatterns = [
    path("add/", AddToWishlistView.as_view()),
    path("remove/<int:product_id>/", RemoveFromWishlistView.as_view()),
    path("", WishlistView.as_view()),
]
