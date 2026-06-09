
import razorpay
from django.conf import settings
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from cart.models import Cart
from users.models import UserAddress
from products.models import Product
from .models import Order, OrderTracking, PaymentStatus, OrderStatus, OrderItem
from .utils import process_order_items


# ----------------- COD ORDER -----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_cod_order(request):
    user = request.user
    data = request.data

    address_id = data.get("address_id")
    items = data.get("cart", [])

    if not address_id:
        return Response({"error": "Address not selected"}, status=400)
    if not items:
        return Response({"error": "Cart empty"}, status=400)

    try:
        user_cart = Cart.objects.get(user=user)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=404)

    try:
        selected_address = UserAddress.objects.get(id=address_id, user=user)
    except UserAddress.DoesNotExist:
        return Response({"error": "Invalid address"}, status=404)

    total_amount = 0
    for item in items:
        try:
            product = Product.objects.get(id=item["product_id"])
        except Product.DoesNotExist:
            continue

        qty = int(item.get("qty", 0))
        if qty <= 0:
            continue

        price = product.sale_price if product.sale_price else product.price
        total_amount += price * qty

    if total_amount <= 0:
        return Response({"error": "Invalid order amount"}, status=400)

    with transaction.atomic():
        order = Order.objects.create(
            user=user,
            full_name=selected_address.full_name,
            phone=selected_address.phone,
            address=selected_address.address_line,
            city=selected_address.city,
            state=selected_address.state,
            pincode=selected_address.pincode,
            payment_method="COD",
            payment_status=PaymentStatus.PENDING,
            total_amount=total_amount,
        )

        # ✅ IMPORTANT FIX HERE
        created = process_order_items(order, user_cart, items, user)

        if not created:
            order.delete()
            return Response(
                {"error": "No valid items (seller missing or out of stock)"},
                status=400
            )

        OrderTracking.objects.create(
            order=order,
            status=OrderStatus.PLACED,
            message="Order placed via COD",
            updated_by=user
        )

    return Response({"status": "success", "order_id": order.id})


    

# ----------------- RAZORPAY ORDER CREATION -----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request):
    amount = request.data.get("amount")
    if not amount:
        return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    payment = client.order.create({
        "amount": int(float(amount) * 100),
        "currency": "INR",
        "payment_capture": 1
    })

    return Response({
        "razorpay_order_id": payment["id"],
        "amount": payment["amount"],
        "razorpay_key": settings.RAZORPAY_KEY_ID
    })


# ----------------- VERIFY PAYMENT -----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    data = request.data
    user = request.user

    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")
    address_id = data.get("address_id")
    items = data.get("cart", [])
    amount = data.get("amount")

    if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
        return Response({"error": "Payment data missing"}, status=400)
    if not address_id:
        return Response({"error": "Address not selected"}, status=400)
    if not items:
        return Response({"error": "Cart empty"}, status=400)

    # prevent duplicate order creation
    if Order.objects.filter(payment_id=razorpay_payment_id).exists():
        return Response({
            "status": "already_processed",
            "message": "Payment already captured. Order already created."
        })

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })
    except:
        return Response({"error": "Payment verification failed"}, status=400)

    try:
        user_cart = Cart.objects.get(user=user)
        selected_address = UserAddress.objects.get(id=address_id, user=user)
    except (Cart.DoesNotExist, UserAddress.DoesNotExist):
        return Response({"error": "Cart or Address not found"}, status=404)

    # 🔥 EVERYTHING MUST BE INSIDE TRANSACTION
    with transaction.atomic():

        # 1️⃣ CREATE ORDER (AUTO CONFIRMED FOR ONLINE PAYMENT)
        order = Order.objects.create(
            user=user,
            full_name=selected_address.full_name,
            phone=selected_address.phone,
            address=selected_address.address_line,
            city=selected_address.city,
            state=selected_address.state,
            pincode=selected_address.pincode,
            total_amount=amount,
            payment_method="RAZORPAY",
            payment_status=PaymentStatus.PAID,
            payment_id=razorpay_payment_id,
            order_status=OrderStatus.CONFIRMED
        )

        created = process_order_items(order, user_cart, items, user)

        if not created:
            order.delete()
            return Response(
                {"error": "No valid items in order"},
                status=400
            )

      

        # 4️⃣ TRACKING HISTORY
        OrderTracking.objects.create(
            order=order,
            status=OrderStatus.CONFIRMED,
            message="Payment successful — order auto confirmed",
            updated_by=user
        )

    return Response({"status": "success", "order_id": order.id}, status=status.HTTP_201_CREATED)
