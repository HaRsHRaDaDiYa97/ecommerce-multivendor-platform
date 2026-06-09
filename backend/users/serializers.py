from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User , SellerProfile

from .models import UserAddress

# -----------------------------
# REGISTER SERIALIZER
# -----------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'full_name', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        return user


# -----------------------------
# CUSTOM LOGIN SERIALIZER (IMPORTANT)
# -----------------------------
class CustomTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = {
            "id": self.user.id,
            "email": self.user.email,
            "full_name": self.user.full_name,
            "role": self.user.role,
            "is_staff": self.user.is_staff,
            "is_superuser": self.user.is_superuser,
            "seller_requested": self.user.seller_requested,
            "is_active": self.user.is_active,  # ✅ ADD THIS
        }

        return data



class SellerAdminSerializer(serializers.ModelSerializer):
    shop_name = serializers.CharField(source="seller_profile.shop_name", read_only=True)
    business_address = serializers.CharField(source="seller_profile.business_address", read_only=True)
    tax_id = serializers.CharField(source="seller_profile.tax_id", read_only=True)
    phone_number = serializers.CharField(source="seller_profile.phone_number", read_only=True)
    is_approved = serializers.BooleanField(source="seller_profile.is_approved", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "role",
             "is_active",   # 👈 IMPORTANT
            "created_at",
            "shop_name",
            "business_address",
            "tax_id",
            "phone_number",
            "is_approved",
        ]



# -----------------------------
# USER / ADMIN PROFILE
# -----------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "role",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["role", "is_active", "created_at"]


# -----------------------------
# SELLER PROFILE
# -----------------------------
class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = [
            "shop_name",
            "business_address",
            "tax_id",
            "phone_number",
            "is_approved",
        ]
        read_only_fields = ["is_approved"]
        
        
        
class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserAddress
        exclude = ("user",)
        extra_kwargs = {
            "landmark": {"required": False, "allow_blank": True},
            "label": {"allow_blank": True},
        }

    def validate_phone(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Invalid phone number")
        return value

    def validate_pincode(self, value):   # 🔥 FIXED NAME
        if len(value) < 6:
            raise serializers.ValidationError("Invalid pincode")
        return value
