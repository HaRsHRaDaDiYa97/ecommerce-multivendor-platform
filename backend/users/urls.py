from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LogoutView
from .views import (
    RegisterView,
    LoginView,
    RequestSellerView,
    SellerRequestListView,
    ApproveSellerView,
    DisapproveSellerView,
    AdminSellerListView,
    DisableSellerView,
     EnableSellerView,  # <-- add this
    AdminUserListView,
    DeleteUserView,
)

from .address_views import (
    get_addresses,
    add_address,
   address_detail,
)



from .views import UserProfileView, SellerProfileView, AdminProfileView


urlpatterns = [

    # AUTH
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("logout/", LogoutView.as_view()),

    # SELLER FLOW
    path("seller/request/", RequestSellerView.as_view()),
    path("seller/requests/", SellerRequestListView.as_view()),
    path("seller/approve/<int:user_id>/", ApproveSellerView.as_view()),
    path("seller/disapprove/<int:user_id>/", DisapproveSellerView.as_view()),

    # ADMIN SELLERS
    path("admin/sellers/", AdminSellerListView.as_view()),
    path("admin/sellers/disable/<int:user_id>/", DisableSellerView.as_view()),
    path("admin/sellers/enable/<int:user_id>/", EnableSellerView.as_view()),

    # PROFILES
    path("profile/user/", UserProfileView.as_view()),
    path("profile/seller/", SellerProfileView.as_view()),
    path("profile/admin/", AdminProfileView.as_view()),

    # ADMIN USERS
    path("admin/users/", AdminUserListView.as_view()),
    path("admin/users/delete/<int:user_id>/", DeleteUserView.as_view()),

    # ADDRESS BOOK 🔥
    path("addresses/", get_addresses),
    path("addresses/add/", add_address),
    
    path("addresses/<int:id>/", address_detail),
]
