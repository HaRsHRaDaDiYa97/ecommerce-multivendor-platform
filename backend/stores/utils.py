from rest_framework.exceptions import PermissionDenied, NotFound
from users.models import SellerProfile
from .models import Store   # 👈 import this


def get_seller_store(user):
    if user.role != "SELLER":
        raise PermissionDenied("Only sellers allowed")

    try:
        seller_profile = user.seller_profile
    except SellerProfile.DoesNotExist:
        raise PermissionDenied("Seller profile not found")

    if not seller_profile.is_approved:
        raise PermissionDenied("Seller not approved")

    # ✅ FIX: handle missing store
    try:
        return seller_profile.store
    except Store.DoesNotExist:
        raise NotFound("You have not created a store yet")