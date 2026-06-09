from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer

# =========================
# ADD TO CART
# =========================
class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        product = Product.objects.get(id=product_id)
        cart, _ = Cart.objects.get_or_create(user=request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        if not created:
            item.quantity += quantity
        item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)


# =========================
# REMOVE
# =========================
class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):
        cart = Cart.objects.get(user=request.user)
        CartItem.objects.filter(cart=cart, product_id=product_id).delete()

        serializer = CartSerializer(cart)
        return Response(serializer.data)


# =========================
# UPDATE QTY
# =========================
class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, product_id):
        quantity = int(request.data.get("quantity"))

        cart = Cart.objects.get(user=request.user)
        item = CartItem.objects.get(cart=cart, product_id=product_id)

        if quantity <= 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)


# =========================
# FETCH CART
# =========================
class CartDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
