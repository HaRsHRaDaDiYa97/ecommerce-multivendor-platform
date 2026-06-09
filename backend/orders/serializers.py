from rest_framework import serializers
from .models import Order, OrderItem

from .models import SellerWithdrawRequest

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name")
    product_image = serializers.ImageField(source="product.image")

    class Meta:
        model = OrderItem
        fields = ["product_name", "product_image", "quantity"]



class SellerWithdrawRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerWithdrawRequest
        fields = ["id", "amount", "status", "requested_at"]
        read_only_fields = ["status", "requested_at"]