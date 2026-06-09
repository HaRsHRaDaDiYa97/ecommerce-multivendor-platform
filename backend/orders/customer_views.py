from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Order, OrderItem, OrderTracking, OrderStatus
from .utils import update_order_status



# ----------------- CUSTOMER ORDERS -----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_orders(request):
    orders = Order.objects.filter(user=request.user).prefetch_related("items__product").order_by("-created_at")
    data = []
    for o in orders:
        data.append({
            "id": o.id,
            "total_amount": o.total_amount,
            "created_at": o.created_at,
            "order_status": o.order_status,
            "payment_status": o.payment_status,
            "items": [
                {
                    "id": item.id,
                    "name": item.product_name or (item.product.name if item.product else "Removed"),
                    "image": item.product_image or (item.product.image.url if item.product and item.product.image else ""),
                    "quantity": item.quantity,
                    "price": item.price,
                    "status": item.item_status,
                } for item in o.items.all()
            ]
        })
    return Response(data)



# ----------------- CUSTOMER MARK ITEM AS RECEIVED -----------------
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_item_received(request, item_id):
    try:
        item = OrderItem.objects.select_related("order", "product").get(id=item_id, order__user=request.user)
    except OrderItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    if item.item_status != OrderStatus.DELIVERED:
        return Response({"error": "Item cannot be marked as received yet"}, status=400)

    item.item_status = OrderStatus.RECEIVED
    item.save(update_fields=["item_status"])

    product_name = item.product_name or (item.product.name if item.product else "Product removed")
    OrderTracking.objects.create(
        order=item.order,
        status=OrderStatus.RECEIVED,
        message=f"Customer confirmed receipt of {product_name}",
        updated_by=request.user
    )

    update_order_status(item.order)

    return Response({"message": "Item marked as received"})




# ----------------- CUSTOMER REQUEST RETURN -----------------
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def request_item_return(request, item_id):
    try:
        item = OrderItem.objects.select_related("order", "product").get(id=item_id, order__user=request.user)
    except OrderItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    if item.item_status not in [OrderStatus.DELIVERED, OrderStatus.RECEIVED]:
        return Response({"error": "Item cannot be returned at this stage"}, status=400)

    item.item_status = OrderStatus.RETURN_REQUESTED
    item.save(update_fields=["item_status"])

    product_name = item.product_name or (item.product.name if item.product else "Product removed")
    OrderTracking.objects.create(
        order=item.order,
        status=OrderStatus.RETURN_REQUESTED,
        message=f"Customer requested return for {product_name}",
        updated_by=request.user
    )

    update_order_status(item.order)

    return Response({"message": "Return request submitted"})
