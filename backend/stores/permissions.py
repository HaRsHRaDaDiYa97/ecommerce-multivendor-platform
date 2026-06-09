from orders.models import OrderItem

def has_purchased_store(user, store):
    return OrderItem.objects.filter(
        order__user=user,
        product__store=store,
        order__order_status="DELIVERED"   # ✅ FINAL CORRECT
    ).exists()