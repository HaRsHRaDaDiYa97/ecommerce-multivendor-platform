from django.urls import path
from .views import (
    AddToCartView,
    RemoveFromCartView,
    UpdateCartItemView,
    CartDetailView,
)

urlpatterns = [
    path("", CartDetailView.as_view()),
    path("add/", AddToCartView.as_view()),
    path("remove/<int:product_id>/", RemoveFromCartView.as_view()),
    path("update/<int:product_id>/", UpdateCartItemView.as_view()),
]
