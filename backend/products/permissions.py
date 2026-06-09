from rest_framework.permissions import BasePermission, SAFE_METHODS



class IsSellerOrAdmin(BasePermission):

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # ✅ Read allowed
        if request.method in SAFE_METHODS:
            return True

        # 👑 Admin
        if request.user.is_staff:
            return True

        # 🧑‍💼 Seller (IMPORTANT FIX 🔥)
        if hasattr(request.user, "seller_profile"):
            return (
                obj.seller == request.user or
                obj.store.seller.user == request.user
            )

        return False

class AdminOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return request.user and request.user.is_staff