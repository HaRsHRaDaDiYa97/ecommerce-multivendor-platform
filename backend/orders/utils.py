from decimal import Decimal
from django.db import transaction
from products.models import Product
from users.models import SellerProfile
from cart.models import CartItem
from .models import OrderItem, Order, OrderTracking, OrderStatus, PaymentStatus, SellerTransaction
from .models import SellerWallet

from decimal import Decimal
from .models import OrderStatus, PaymentStatus, SellerTransaction



# =========================================================
# CREATE ORDER ITEMS FROM CART
# =========================================================

# =========================================================
# CREATE ORDER ITEMS FROM CART
# =========================================================
def process_order_items(order: Order, user_cart, items, user):
    created_any_item = False

    for item in items:
        try:
            product = Product.objects.select_for_update().get(id=item["product_id"])
        except Product.DoesNotExist:
            continue

        qty_requested = int(item.get("qty", 0))
        if qty_requested <= 0:
            continue

        if product.stock <= 0:
            CartItem.objects.filter(cart=user_cart, product=product).delete()
            continue

        qty_to_order = min(qty_requested, product.stock)

        # ✅ USE STORE → SELLERPROFILE (CORRECT WAY)
        if not product.store or not product.store.seller:
            print(f"❌ Skipping product {product.id} - no store/seller")
            continue

        seller = product.store.seller  # 🔥 FIXED

        OrderItem.objects.create(
            order=order,
            product=product,
            seller=seller,
            quantity=qty_to_order,
            price=product.sale_price if product.sale_price else product.price,
            item_status=order.order_status,

            product_name=product.name,
            product_slug=product.slug,
            product_image=product.image.url if product.image else "",
            category_name=product.category.name if product.category else "",
            sku=product.sku
        )

        created_any_item = True

        # stock update
        product.stock -= qty_to_order
        product.save(update_fields=["stock"])

        # cart update
        cart_item = CartItem.objects.filter(cart=user_cart, product=product).first()
        if cart_item:
            if product.stock <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = min(cart_item.quantity, product.stock)
                cart_item.save(update_fields=["quantity"])

    return created_any_item




# def update_order_status(order):
#     items = order.items.all()
#     total_items = items.count()

#     if total_items == 0:
#         return  # safety

#     status_counts = {status: 0 for status, _ in OrderStatus.choices}

#     for item in items:
#         status_counts[item.item_status] += 1

#     # Payment condition
#     online_paid = order.payment_status == PaymentStatus.PAID
#     cod_delivered = (
#         order.payment_method == "COD"
#         and status_counts[OrderStatus.DELIVERED] > 0
#     )

#     platform_has_money = online_paid or cod_delivered

#     # =========================================================
#     # SELLER TRANSACTIONS
#     # =========================================================
#     if platform_has_money:
#         for item in items:

#             if item.item_status != OrderStatus.DELIVERED:
#                 continue

#             if SellerTransaction.objects.filter(order_item=item).exists():
#                 continue

#             total_price = Decimal(item.price) * item.quantity
#             commission = total_price * Decimal("0.10")
#             seller_earning = total_price - commission

#             with transaction.atomic():
#                 SellerTransaction.objects.create(
#                     seller=item.seller,
#                     order_item=item,
#                     amount=total_price,
#                     commission=commission,
#                     seller_earning=seller_earning,
#                     status="pending"
#                 )

#                 wallet, _ = SellerWallet.objects.get_or_create(seller=item.seller)
#                 wallet.pending_balance += seller_earning
#                 wallet.save(update_fields=["pending_balance"])

#     # =========================================================
#     # ORDER STATUS LOGIC
#     # =========================================================

#     if status_counts[OrderStatus.DELIVERED] + status_counts[OrderStatus.RECEIVED] == total_items:
#         order.order_status = OrderStatus.DELIVERED

#         if order.payment_method == "COD":
#             order.payment_status = PaymentStatus.COD_COMPLETE

#         order.save(update_fields=["order_status", "payment_status"])
#         return

#     if status_counts[OrderStatus.RETURNED] == total_items:
#         order.order_status = OrderStatus.RETURNED

#     elif status_counts[OrderStatus.RETURN_REQUESTED] > 0:
#         order.order_status = OrderStatus.RETURN_REQUESTED

#     elif status_counts[OrderStatus.OUT_FOR_DELIVERY] > 0:
#         order.order_status = OrderStatus.OUT_FOR_DELIVERY

#     elif status_counts[OrderStatus.SHIPPED] > 0:
#         order.order_status = OrderStatus.SHIPPED

#     elif status_counts[OrderStatus.PACKED] > 0:
#         order.order_status = OrderStatus.PACKED

#     elif status_counts[OrderStatus.CONFIRMED] > 0:
#         order.order_status = OrderStatus.CONFIRMED

#     elif status_counts[OrderStatus.CANCELLED] == total_items:
#         order.order_status = OrderStatus.CANCELLED

#     else:
#         order.order_status = OrderStatus.PLACED

#     order.save(update_fields=["order_status"])




def update_order_status(order):
    items = order.items.all()
    total_items = items.count()

    if total_items == 0:
        return

    status_counts = {status: 0 for status, _ in OrderStatus.choices}

    for item in items:
        status_counts[item.item_status] += 1

    # =========================
    # ORDER STATUS UPDATE FIRST ✅
    # =========================

    if status_counts[OrderStatus.DELIVERED] + status_counts[OrderStatus.RECEIVED] == total_items:
        order.order_status = OrderStatus.DELIVERED

        if order.payment_method == "COD":
            order.payment_status = PaymentStatus.COD_COMPLETE

    elif status_counts[OrderStatus.RETURNED] == total_items:
        order.order_status = OrderStatus.RETURNED

    elif status_counts[OrderStatus.RETURN_REQUESTED] > 0:
        order.order_status = OrderStatus.RETURN_REQUESTED

    elif status_counts[OrderStatus.OUT_FOR_DELIVERY] > 0:
        order.order_status = OrderStatus.OUT_FOR_DELIVERY

    elif status_counts[OrderStatus.SHIPPED] > 0:
        order.order_status = OrderStatus.SHIPPED

    elif status_counts[OrderStatus.PACKED] > 0:
        order.order_status = OrderStatus.PACKED

    elif status_counts[OrderStatus.CONFIRMED] > 0:
        order.order_status = OrderStatus.CONFIRMED

    elif status_counts[OrderStatus.CANCELLED] == total_items:
        order.order_status = OrderStatus.CANCELLED

    else:
        order.order_status = OrderStatus.PLACED

    order.save()

    # =========================
    # 🔥 NOW CREATE TRANSACTIONS (AFTER PAYMENT FIX)
    # =========================

    platform_has_money = (
        order.payment_status == PaymentStatus.PAID or
        order.payment_status == PaymentStatus.COD_COMPLETE
    )

    if not platform_has_money:
        return

    for item in items:

        # only for delivered items
        if item.item_status != OrderStatus.DELIVERED:
            continue

        # skip if already exists
        if SellerTransaction.objects.filter(order_item=item).exists():
            continue

        total_price = Decimal(item.price) * item.quantity
        commission = total_price * Decimal("0.10")
        seller_earning = total_price - commission

        with transaction.atomic():
            # create transaction
            SellerTransaction.objects.create(
                seller=item.seller,
                order_item=item,
                amount=total_price,
                commission=commission,
                seller_earning=seller_earning,
                status="pending"
            )

            # update wallet
            wallet, _ = SellerWallet.objects.get_or_create(seller=item.seller)
            wallet.pending_balance += seller_earning
            wallet.save()