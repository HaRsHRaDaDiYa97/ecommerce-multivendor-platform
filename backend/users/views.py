from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from products.models import Product   # 🔥 IMPORTANT
from django.core.mail import send_mail
from django.conf import settings
from .models import User, SellerProfile

from .serializers import UserProfileSerializer, SellerProfileSerializer

from .serializers import (
    RegisterSerializer,
    CustomTokenSerializer,
    SellerAdminSerializer,  # ✅ ADD THIS
)

from .models import User


# -----------------------------
# REGISTER
# -----------------------------
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# LOGIN (CUSTOM JWT)
# -----------------------------
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Make token invalid (requires rest_framework_simplejwt.token_blacklist)
            return Response({"message": "Logout successful"}, status=200)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=400)
        
        

# -----------------------------
# REQUEST SELLER
# -----------------------------
class RequestSellerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.role == "SELLER":
            return Response({"message": "You are already a seller"}, status=status.HTTP_400_BAD_REQUEST)
        if user.seller_requested:
            return Response({"message": "Seller request already pending"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile_data = request.data
            SellerProfile.objects.create(
                user=user,
                shop_name=profile_data.get("shop_name"),
                business_address=profile_data.get("business_address"),
                tax_id=profile_data.get("tax_id"),
                phone_number=profile_data.get("phone_number"),
                is_approved=False
            )

            user.seller_requested = True
            user.save()

            return Response({"message": "Seller request sent to admin"}, status=status.HTTP_200_OK)
        except Exception as e:
            print("Error creating seller profile:", e)
            return Response({"message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# -----------------------------
# ADMIN: VIEW SELLER REQUESTS
# -----------------------------
class SellerRequestListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.filter(seller_requested=True)
        data = []
        for u in users:
            profile = getattr(u, "seller_profile", None)
            data.append({
                "id": u.id,
                "email": u.email,
                "full_name": u.full_name,
                "shop_name": profile.shop_name if profile else "",
                "business_address": profile.business_address if profile else "",
                "tax_id": profile.tax_id if profile else "",
                "phone_number": profile.phone_number if profile else "",
            })
        return Response(data)



# -----------------------------
# ADMIN: APPROVE SELLER
# -----------------------------
class ApproveSellerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if not user.seller_requested:
            return Response({"message": "User did not request seller"}, status=status.HTTP_400_BAD_REQUEST)

        user.role = "SELLER"
        user.seller_requested = False
        user.save()

        # Mark profile as approved
        profile = getattr(user, "seller_profile", None)
        if profile:
            profile.is_approved = True
            profile.save()

        # Send approval email
        send_mail(
            subject="Your Seller Account is Approved",
            message=f"Hi {user.full_name}, your seller account has been approved!",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )

        return Response({"message": "User approved as seller"}, status=status.HTTP_200_OK)




class DisapproveSellerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)

        if not user.seller_requested:
            return Response({"message": "No pending seller request for this user"}, status=status.HTTP_400_BAD_REQUEST)

        # Cancel the seller request
        user.seller_requested = False
        user.save()

        # Delete seller profile if exists
        profile = getattr(user, "seller_profile", None)
        if profile:
            profile.delete()

        # Send disapproval email
        send_mail(
            subject="Your Seller Request is Disapproved",
            message=f"Hi {user.full_name}, unfortunately your seller request has been disapproved by the admin.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )

        return Response({"message": "Seller request disapproved and cancelled"}, status=status.HTTP_200_OK)



# -----------------------------
# ADMIN: VIEW ALL SELLERS
# -----------------------------
class AdminSellerListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        sellers = User.objects.filter(role="SELLER")
        serializer = SellerAdminSerializer(sellers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




# -----------------------------
# ADMIN: DISABLE SELLER
# -----------------------------
from products.models import Product

class DisableSellerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        seller = get_object_or_404(User, id=user_id, role="SELLER")

        # 🔥 1. Delete all seller products
        Product.objects.filter(seller=seller).delete()

        # 🔥 2. Delete seller profile
        if hasattr(seller, "seller_profile"):
            seller.seller_profile.delete()

        # 🔥 3. Convert seller → normal user
        seller.role = "USER"
        seller.is_active = True
        seller.save()

        send_mail(
            subject="Seller Account Disabled",
            message="Your seller account has been disabled. You are now a normal user.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[seller.email],
            fail_silently=True,
        )

        return Response(
            {"message": "Seller disabled, products deleted, converted to user"},
            status=status.HTTP_200_OK
        )


# -----------------------------
# ADMIN: ENABLE SELLER
# -----------------------------
class EnableSellerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        seller = get_object_or_404(User, id=user_id, role="SELLER")

        seller.is_active = True
        seller.save()

        send_mail(
            subject="Seller Account Enabled",
            message="Your seller account has been re-enabled by admin.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[seller.email],
            fail_silently=True,
        )

        return Response(
            {"message": "Seller enabled successfully"},
            status=status.HTTP_200_OK
        )


class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.filter(role="USER")  # Only normal users
        data = []
        for idx, u in enumerate(users, start=1):
            data.append({
                "serial": idx,       # 1,2,3… for frontend
                "id": u.id,
                "full_name": u.full_name,
                "email": u.email,
                "is_active": u.is_active,
                "created_at": u.created_at,
            })
        return Response(data)


class DeleteUserView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, user_id):
        # Only delete normal users, not sellers/admins
        user = get_object_or_404(User, id=user_id, role="USER")
        user.delete()
        return Response(
            {"message": "User deleted successfully"},
            status=status.HTTP_200_OK
        )
        
        
# USER PROFILE
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"user": UserProfileSerializer(request.user).data})

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User profile updated", "user": serializer.data})
        return Response(serializer.errors, status=400)




class SellerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Only sellers allowed
        if user.role != "SELLER":
            return Response(
                {"message": "You are not a seller."},
                status=status.HTTP_403_FORBIDDEN
            )

        # AUTO CREATE SELLER PROFILE IF MISSING
        seller_profile, created = SellerProfile.objects.get_or_create(
            user=user,
            defaults={
                "shop_name": "",
                "business_address": "",
                "tax_id": "",
                "phone_number": ""
            }
        )

        return Response({
            "user": UserProfileSerializer(user).data,
            "seller_profile": SellerProfileSerializer(seller_profile).data,
            "is_seller": True
        })

    def put(self, request):
        user = request.user

        if user.role != "SELLER":
            return Response(
                {"message": "Only sellers can update profile."},
                status=status.HTTP_403_FORBIDDEN
            )

        seller_profile, _ = SellerProfile.objects.get_or_create(user=user)

        serializer = SellerProfileSerializer(
            seller_profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Seller profile updated successfully",
                "seller_profile": serializer.data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

# ADMIN PROFILE
class AdminProfileView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        return Response({"user": UserProfileSerializer(request.user).data})

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Admin profile updated", "user": serializer.data})
        return Response(serializer.errors, status=400)
