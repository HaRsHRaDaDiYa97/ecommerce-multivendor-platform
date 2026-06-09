from collections import defaultdict
from decimal import Decimal
from django.db.models import Sum, Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .settlement import release_seller_payments  # import here
from .models import OrderItem, OrderTracking, OrderStatus, SellerTransaction,SellerWithdrawRequest
from .utils import update_order_status
from .models import SellerWallet


from django.db.models import Sum, Avg, F, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from products.models import Product
from stores.models import Store, StoreReview
from .models import OrderItem, OrderStatus



# ----------------- DYNAMIC VALID STATUSES -----------------
VALID_STATUSES = [choice[0] for choice in OrderStatus.choices]

# ----------------- HELPER: GET SELLER -----------------
def get_seller(request):
    if not hasattr(request.user, "seller_profile"):
        raise PermissionDenied("Seller account required")
    return request.user.seller_profile






@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_dashboard_stats(request):
    seller = get_seller(request)

    # ✅ WALLET BASED TOTAL SALES (FIXED)
    wallet, _ = SellerWallet.objects.get_or_create(seller=seller)

    total_sales = (
        wallet.pending_balance +
        wallet.available_balance +
        wallet.withdrawn_balance
    )

    # ✅ PENDING ORDERS
    pending_orders = OrderItem.objects.filter(
        seller=seller,
        item_status__in=[
            OrderStatus.PLACED,
            OrderStatus.CONFIRMED,
            OrderStatus.PACKED,
            OrderStatus.SHIPPED,
            OrderStatus.OUT_FOR_DELIVERY
        ]
    ).count()

    # ✅ ACTIVE PRODUCTS
    active_products = Product.objects.filter(
        seller=seller.user
    ).count()

    # ✅ STORE RATING
    store = Store.objects.filter(seller=seller).first()

    if store:
        avg_rating = StoreReview.objects.filter(
            store=store
        ).aggregate(avg=Avg("rating"))["avg"] or 0
    else:
        avg_rating = 0

    return Response({
        "total_sales": float(total_sales),
        "pending_orders": pending_orders,
        "active_products": active_products,
        "average_rating": round(avg_rating, 1)
    })
    
    

# ----------------- SELLER UPDATE ITEM STATUS -----------------
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def seller_update_item_status(request, item_id):
    """
    Update the status of a seller's order item.
    Handles e-commerce friendly transitions and return approvals/rejections.
    """
    seller = get_seller(request)
    try:
        # Fetch the order item
        item = OrderItem.objects.select_related("order", "seller", "product").get(id=item_id)

        if item.seller != seller:
            return Response({"error": "Not allowed"}, status=403)

        # Get the requested new status
        new_status = request.data.get("status")
        if not new_status:
            return Response({"error": "Missing 'status' in request"}, status=400)

        if new_status not in VALID_STATUSES:
            return Response({
                "error": "Invalid status",
                "requested_status": new_status,
                "valid_statuses": VALID_STATUSES
            }, status=400)

        # ----------------- FLEXIBLE STATUS TRANSITIONS -----------------
        # Allow reverting to previous states for e-commerce flow
        ALLOWED_TRANSITIONS = {
            OrderStatus.PLACED: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
            OrderStatus.CONFIRMED: [OrderStatus.PACKED, OrderStatus.CANCELLED, OrderStatus.PLACED],
            OrderStatus.PACKED: [OrderStatus.SHIPPED, OrderStatus.CONFIRMED],
            OrderStatus.SHIPPED: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.PACKED],
            OrderStatus.OUT_FOR_DELIVERY: [OrderStatus.DELIVERED, OrderStatus.SHIPPED],
            OrderStatus.DELIVERED: [OrderStatus.RECEIVED, OrderStatus.RETURN_REQUESTED],
            OrderStatus.RECEIVED: [],
            OrderStatus.RETURN_REQUESTED: [OrderStatus.RETURNED, OrderStatus.RETURN_REJECTED],
            OrderStatus.RETURN_REJECTED: [OrderStatus.CONFIRMED, OrderStatus.DELIVERED],
            OrderStatus.CANCELLED: [],
        }

        allowed_next = ALLOWED_TRANSITIONS.get(item.item_status, [])

        if new_status not in allowed_next:
            return Response({
                "error": "Invalid status transition",
                "current_status": item.item_status,
                "requested_status": new_status,
                "allowed_next_statuses": allowed_next
            }, status=400)

        # ----------------- HANDLE RETURN REJECTION -----------------
        # If rejecting a return, restore original status (DELIVERED or CONFIRMED)
        if item.item_status == OrderStatus.RETURN_REQUESTED and new_status == OrderStatus.RETURN_REJECTED:
            if item.order.payment_method == "COD" and item.item_status == OrderStatus.DELIVERED:
                # Restore to DELIVERED if it was delivered
                new_status = OrderStatus.DELIVERED
            else:
                # Otherwise back to CONFIRMED
                new_status = OrderStatus.CONFIRMED

        # ----------------- UPDATE ITEM STATUS -----------------
        item.item_status = new_status
        item.save(update_fields=["item_status"])

        # ----------------- CREATE TRACKING ENTRY -----------------
        OrderTracking.objects.create(
            order=item.order,
            status=new_status,
            message=f"Seller updated {item.product.name if item.product else 'Product'} to {new_status.replace('_',' ').title()}",
            updated_by=request.user
        )

        # ----------------- UPDATE PARENT ORDER STATUS -----------------
        update_order_status(item.order)

        return Response({"message": f"Item status updated to {new_status}"})

    except OrderItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)
    
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_orders(request):
    seller = get_seller(request)

    items = (
        OrderItem.objects
        .select_related("order", "product")
        .filter(seller=seller)
        .order_by("-order__created_at")
    )

    grouped_orders = {}

    for item in items:
        order = item.order

        if order.id not in grouped_orders:
            grouped_orders[order.id] = {
                "order_id": order.id,
                "customer": order.full_name,
                "address": order.address,
                "phone": order.phone,
                "date": order.created_at,
                "products": []
            }

        grouped_orders[order.id]["products"].append({
            "item_id": item.id,
            "product": item.product.name if item.product else "Deleted Product",
            "quantity": item.quantity,
            "price": item.price,
            "status": item.item_status,
        })

    return Response(list(grouped_orders.values()))



# ----------------- SELLER ORDERS BY STATUS -----------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_orders_by_status(request, status):
    seller = get_seller(request)
    if status not in VALID_STATUSES:
        return Response({"error": "Invalid status"}, status=400)
    items = OrderItem.objects.select_related("order","product").filter(seller=seller, item_status=status).order_by("-order__created_at")
    data = []
    for item in items:
        data.append({
            "item_id": item.id,
            "product": item.product.name if item.product else "Deleted Product",
            "quantity": item.quantity,
            "price": item.price,
            "status": item.item_status,
            "order_id": item.order.id,
            "customer": item.order.full_name,
            "address": item.order.address,
            "phone": item.order.phone,
            "date": item.order.created_at,
        })
    return Response(data)


# ----------------- SELLER EARNINGS -----------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_earnings(request):
    seller = get_seller(request)

    # 🔥 Release payments
    release_seller_payments()

    # ✅ FIX: safe wallet access
    wallet, created = SellerWallet.objects.get_or_create(
        seller=seller,
        defaults={
            "pending_balance": 0,
            "available_balance": 0,
            "withdrawn_balance": 0
        }
    )

    # Withdraw requests
    withdraws = SellerWithdrawRequest.objects.filter(seller=seller).order_by('-requested_at')

    withdraw_data = [
        {
            "id": w.id,
            "amount": float(w.amount),
            "status": w.status,
            "requested_at": w.requested_at,
            "processed_at": w.processed_at,
            "admin_note": w.admin_note
        }
        for w in withdraws
    ]

    return Response({
        "pending_balance": float(wallet.pending_balance),
        "available_balance": float(wallet.available_balance),
        "withdrawn_balance": float(wallet.withdrawn_balance),
        "total_earnings": float(
            wallet.pending_balance + wallet.available_balance + wallet.withdrawn_balance
        ),
        "withdraw_requests": withdraw_data
    })



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_return_requests(request):
    seller = get_seller(request)
    items = OrderItem.objects.select_related("order","product").filter(
        seller=seller, item_status=OrderStatus.RETURN_REQUESTED
    ).order_by("-order__created_at")

    data = []
    for item in items:
        data.append({
            "item_id": item.id,
            "product": item.product.name if item.product else "Deleted Product",
            "quantity": item.quantity,
            "price": item.price,
            "status": item.item_status,
            "order_id": item.order.id,
            "customer": item.order.full_name,
            "address": item.order.address,
            "phone": item.order.phone,
            "date": item.order.created_at,
        })
    return Response(data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def seller_handle_return_request(request, item_id):
    seller = get_seller(request)
    try:
        item = OrderItem.objects.select_related("order", "seller", "product").get(id=item_id)
        if item.seller != seller:
            return Response({"error": "Not allowed"}, status=403)

        if item.item_status != OrderStatus.RETURN_REQUESTED:
            return Response({"error": "No return request for this item"}, status=400)

        action = request.data.get("action")  # expected: "approve" or "reject"
        if action not in ["approve", "reject"]:
            return Response({"error": "Invalid action"}, status=400)

        if action == "approve":
            item.item_status = OrderStatus.RETURNED
            message = f"Seller approved return for {item.product.name}"
        else:
            item.item_status = OrderStatus.CONFIRMED  # back to confirmed or original status
            message = f"Seller rejected return for {item.product.name}"

        item.save(update_fields=["item_status"])

        OrderTracking.objects.create(
            order=item.order,
            status=item.item_status,
            message=message,
            updated_by=request.user
        )

        update_order_status(item.order)
        return Response({"message": message})

    except OrderItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)
