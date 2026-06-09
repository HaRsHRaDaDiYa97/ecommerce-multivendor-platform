# wishlist/serializers.py
from rest_framework import serializers
from .models import Wishlist
from products.serializers import ProductSerializer

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # ✅ include product details

    class Meta:
        model = Wishlist
        fields = ['id', 'product']
