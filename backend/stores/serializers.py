from rest_framework import serializers
from .models import Store, StoreReview


class StoreReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = StoreReview
        fields = ["id", "user_name", "rating", "comment", "created_at"]


class PublicStoreSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField()
    seller_since = serializers.DateTimeField(source="seller.user.created_at", read_only=True)

    class Meta:
        model = Store
        fields = [
            "name",
            "slug",
            "logo",
            "banner",
            "description",
            "tagline",
            "rating",
            "total_reviews",
            "is_verified",
            "seller_since",
            "reviews",
        ]

    def get_reviews(self, obj):
        latest_reviews = obj.reviews.order_by("-created_at")[:5]
        return StoreReviewSerializer(latest_reviews, many=True).data


class CreateStoreReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreReview
        fields = ["rating", "comment"]



class SellerStoreSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False, allow_null=True, use_url=True)
    banner = serializers.ImageField(required=False, allow_null=True, use_url=True)

    class Meta:
        model = Store
        fields = [
            "name",
            "logo",
            "banner",
            "description",
            "tagline",
            "support_email",
            "support_phone",
        ]


class FollowedStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ["name", "slug", "logo", "rating", "total_reviews"]
