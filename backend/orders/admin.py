from django.contrib import admin
from .models import Order, OrderItem, OrderTracking, SellerTransaction
from .models import SellerWallet


# Inline for Order Items
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = (
        "product_name",
        "product_slug",
        "product_image",
        "category_name",
        "sku",
        "quantity",
        "price",
        "item_status",
        "created_at",
        "updated_at",
    )


# Inline for Order Tracking
class OrderTrackingInline(admin.TabularInline):
    model = OrderTracking
    extra = 0
    readonly_fields = ("status", "message", "updated_by", "timestamp")


# Order Admin
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "order_status", "payment_status", "total_amount", "created_at")
    list_filter = ("order_status", "payment_status")
    search_fields = ("user__username", "full_name", "phone", "id")
    inlines = [OrderItemInline, OrderTrackingInline]


# OrderItem Admin
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "product",
        "seller",
        "quantity",
        "price",
        "item_status",
        "created_at",
        "updated_at",
    )
    list_filter = ("item_status", "seller")
    search_fields = ("product__name", "seller__user__username")


# OrderTracking Admin
@admin.register(OrderTracking)
class OrderTrackingAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "status", "message", "updated_by", "timestamp")
    list_filter = ("status",)
    search_fields = ("order__id", "message")



@admin.register(SellerTransaction)
class SellerTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "seller",
        "order_item",
        "amount",
        "commission",
        "seller_earning",
        "status",
        "release_date",
        "created_at",
    )

    list_filter = ("status", "release_date", "seller")
    search_fields = ("seller__user__username", "order_item__product__name")


@admin.register(SellerWallet)
class SellerWalletAdmin(admin.ModelAdmin):
    list_display = (
        "seller",
        "pending_balance",
        "available_balance",
        "withdrawn_balance",
    )
