from rest_framework import serializers
from .models import Product, Category, ProductImage, Tag
from reviews.models import Review

# -------------------------
# TAG SERIALIZER
# -------------------------
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

# -------------------------
# CATEGORY SERIALIZERS
# -------------------------
class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'subcategories']

# -------------------------
# PRODUCT IMAGE SERIALIZER
# -------------------------
class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text']

    def get_image(self, obj):
        request = self.context.get('request')  # 🔑 Important
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

# -------------------------
# REVIEW SERIALIZER
# -------------------------
class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']

# -------------------------
# PRODUCT SERIALIZER (GET)
# -------------------------
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    images = serializers.SerializerMethodField()  # ← change here
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    store_slug = serializers.SerializerMethodField()
    store_name = serializers.SerializerMethodField()
    store_logo = serializers.SerializerMethodField()
    store_banner = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'category', 'description',
            'price', 'sale_price', 'stock',
            'weight', 'length', 'width', 'height',
            'tags', 'images', 'reviews', 'average_rating',
            'store_slug', 'store_name', 'store_logo', 'store_banner',
            'created_at'
        ]


    def get_images(self, obj):
        request = self.context.get("request")
        image_list = []

        # Include main product image
        if obj.image:
            image_list.append({
                "id": None,
                "image": request.build_absolute_uri(obj.image.url) if request else obj.image.url,
                "alt_text": "",
            })

        # Include additional ProductImage objects
        for img in obj.images.all():
            image_list.append({
                "id": img.id,
                "image": request.build_absolute_uri(img.image.url) if request else img.image.url,
                "alt_text": img.alt_text,
            })

        return image_list

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 0
        return round(sum(r.rating for r in reviews)/reviews.count(), 2)

    def get_store_slug(self, obj):
        return obj.store.slug if obj.store else None

    def get_store_name(self, obj):
        return obj.store.name if obj.store else None

    def get_store_logo(self, obj):
        request = self.context.get("request")
        if obj.store and obj.store.logo:
            return request.build_absolute_uri(obj.store.logo.url) if request else obj.store.logo.url
        return None

    def get_store_banner(self, obj):
        request = self.context.get("request")
        if obj.store and obj.store.banner:
            return request.build_absolute_uri(obj.store.banner.url) if request else obj.store.banner.url
        return None

# -------------------------
# PRODUCT CREATE / UPDATE SERIALIZER
# -------------------------
# PRODUCT CREATE/UPDATE SERIALIZER
class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'name','sku','category','description',
            'price','sale_price','stock',
            'weight','length','width','height',
            'image','tags'
        ]

    def validate_category(self, category):
        if category.subcategories.exists():
            raise serializers.ValidationError(
                "Cannot assign product to main category. Choose a sub-category."
            )
        return category