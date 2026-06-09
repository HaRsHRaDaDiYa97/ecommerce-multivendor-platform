from django.urls import path
from .views import public_store_detail
from .views import create_store_review
from .views import seller_store_me

from .views import create_store
from .views import (
    toggle_follow_store,
    my_following_stores,
    store_followers_count,
)


urlpatterns = [
    path("me/", seller_store_me),

path("create/", create_store),

    path("following/", my_following_stores),

    path("<slug:slug>/follow/", toggle_follow_store),
    path("<slug:slug>/followers/", store_followers_count),

    path("<slug:slug>/review/", create_store_review),
    path("<slug:slug>/", public_store_detail),
]
