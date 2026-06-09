from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Order, OrderTracking


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_tracking(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    tracking = OrderTracking.objects.filter(order=order).order_by("timestamp")
    return Response({
        "id": order.id,
        "created_at": order.created_at,
        "payment_method": order.payment_method,
        "order_status": order.order_status,
        "total_amount": order.total_amount,
        "tracking": [
            {"id": t.id, "status": t.status, "message": t.message, "timestamp": t.timestamp}
            for t in tracking
        ],
        "items": [
            {
                "id": item.id,
                "name": item.product_name or (item.product.name if item.product else "Product removed"),
                "image": item.product_image or (item.product.image.url if item.product and item.product.image else ""),
                "slug": item.product_slug or (item.product.slug if item.product else None),
                "category": item.category_name or (item.product.category.name if item.product and item.product.category else ""),
                "sku": item.sku or (item.product.sku if item.product else ""),
                "quantity": item.quantity,
                "price": item.price,
                "total": float(item.price) * item.quantity,
                "status": item.item_status,
                "product_exists": bool(item.product),
            }
            for item in order.items.all()
        ]
    })
