from rest_framework import viewsets
from .models import Product, Category, Tag
from .serializers import (
    ProductSerializer,
    ProductCreateSerializer,
    CategorySerializer,
    TagSerializer
)
from .permissions import IsSellerOrAdmin, AdminOrReadOnly
from rest_framework.pagination import PageNumberPagination



# -------------------------
# Custom Pagination
# -------------------------
class ProductPagination(PageNumberPagination):
    page_size = 12  # number of products per page
    page_size_query_param = 'page_size'
    max_page_size = 100



# =========================
# PRODUCT VIEWSET
# =========================
class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSellerOrAdmin]
    pagination_class = ProductPagination

    # -------------------------
    # Serializer Selection
    # -------------------------
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductSerializer

    # -------------------------
    # Pass request to serializer
    # -------------------------
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    # -------------------------
    # QUERYSET (FINAL FIX ✅)
    # -------------------------
    def get_queryset(self):
        user = self.request.user

        queryset = Product.objects.select_related(
            'store', 'category'
        ).prefetch_related(
            'tags', 'images'
        )
        
        # 👑 Admin → all products
        if user.is_authenticated and user.is_staff:
            return queryset
         # =======================
        # Filtering by store_slug ✅
        # =======================
        store_slug = self.request.query_params.get('store_slug')
        if store_slug:
            queryset = queryset.filter(store__slug=store_slug)
        
        
         # =======================
        # Filtering
        # =======================
        category = self.request.query_params.get('category')
        tag = self.request.query_params.get('tag')
        search = self.request.query_params.get('search')
        ordering = self.request.query_params.get('ordering')

        if category:
            queryset = queryset.filter(category_id=category)

        if tag:
            queryset = queryset.filter(tags__id=tag)

        if search:
            queryset = queryset.filter(name__icontains=search)

        if ordering:
            # DRF ordering format: "-price" or "price"
            queryset = queryset.order_by(ordering)

        

        # 🧑‍💼 Seller → filter ONLY for list view
        if user.is_authenticated and hasattr(user, "seller_profile"):
            if self.action == "list":
                return queryset.filter(seller=user)

        # 👤 Others → all products
        return queryset

    # -------------------------
    # CREATE PRODUCT ✅
    # -------------------------
    def perform_create(self, serializer):
        user = self.request.user

        if hasattr(user, "seller_profile"):
            serializer.save(
                seller=user,
                store=user.seller_profile.store
            )
        else:
            serializer.save()

    # -------------------------
    # UPDATE PRODUCT ✅
    # -------------------------
    def perform_update(self, serializer):
        user = self.request.user

        if hasattr(user, "seller_profile"):
            serializer.save(
                seller=user,
                store=user.seller_profile.store
            )
        else:
            serializer.save()


# =========================
# CATEGORY VIEWSET
# =========================
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AdminOrReadOnly]

    def get_queryset(self):
        queryset = Category.objects.all()
        search = self.request.query_params.get('search')

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


# =========================
# TAG VIEWSET
# =========================
class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [AdminOrReadOnly]

    def get_queryset(self):
        queryset = Tag.objects.filter(is_active=True)
        search = self.request.query_params.get('search')

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset