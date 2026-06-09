from django.db import models
from django.conf import settings
from products.models import Product
from users.models import SellerProfile
from django.utils import timezone
from datetime import timedelta

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q


User = settings.AUTH_USER_MODEL

def default_release_date():
    return timezone.now() + timedelta(seconds=10)


class OrderStatus(models.TextChoices):
    PLACED = "PLACED", "Placed"
    CONFIRMED = "CONFIRMED", "Confirmed"
    PACKED = "PACKED", "Packed"
    SHIPPED = "SHIPPED", "Shipped"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY", "Out For Delivery"
    DELIVERED = "DELIVERED", "Delivered"
    CANCELLED = "CANCELLED", "Cancelled"
    RETURN_REQUESTED = "RETURN_REQUESTED", "Return Requested"
    RETURNED = "RETURNED", "Returned"
    RETURN_REJECTED = "RETURN_REJECTED", "Return Rejected"  # ADD THIS
    RECEIVED = "RECEIVED", "Customer Received"


class PaymentStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    COD_COMPLETE = "COD_COMPLETE", "COD Complete"
    PAID = "PAID", "Paid"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")

    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=120)
    pincode = models.CharField(max_length=10)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    payment_id = models.CharField(max_length=150, null=True, blank=True)


    payment_method = models.CharField(max_length=20, default="COD")
    payment_status = models.CharField(
        max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )

    order_status = models.CharField(
        max_length=30, choices=OrderStatus.choices, default=OrderStatus.PLACED
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.email}"  # Use email instead of username



class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # Product snapshot
    product_name = models.CharField(max_length=255, null=True, blank=True)
    product_slug = models.SlugField(null=True, blank=True)
    product_image = models.URLField(blank=True, null=True)
    category_name = models.CharField(max_length=120, blank=True, null=True)
    sku = models.CharField(max_length=100, blank=True, null=True)

    item_status = models.CharField(
        max_length=30,
        choices=OrderStatus.choices,
        default=OrderStatus.PLACED
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product} ({self.quantity}) - {self.item_status}"


class OrderTracking(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="tracking")
    status = models.CharField(max_length=30, choices=OrderStatus.choices)
    message = models.TextField()
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"{self.order.id} - {self.status}"



class SellerTransaction(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending Release"),
        ("available", "Available to Withdraw"),
        ("paid", "Paid to Seller"),
        ("cancelled", "Cancelled/Refunded")
    )

    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE)
    order_item = models.OneToOneField(OrderItem, on_delete=models.CASCADE)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission = models.DecimalField(max_digits=10, decimal_places=2)
    seller_earning = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    # 🔥 money hold for 7 days
    release_date = models.DateTimeField(default=default_release_date)


    created_at = models.DateTimeField(auto_now_add=True)

# orders/models.py

class SellerWallet(models.Model):
    seller = models.OneToOneField(SellerProfile, on_delete=models.CASCADE, related_name="wallet")

    pending_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    available_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    withdrawn_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.seller.shop_name} Wallet"




class SellerWithdrawRequest(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("paid", "Paid to Seller"),
        ("rejected", "Rejected"),
    )

    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE)
    wallet = models.ForeignKey(SellerWallet, on_delete=models.CASCADE)

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    admin_note = models.TextField(blank=True, null=True)

    def clean(self):
        if self.amount <= 0:
            raise ValidationError("Withdraw amount must be greater than zero.")

        if self.wallet.available_balance < self.amount:
            raise ValidationError("Insufficient available balance.")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["seller"],
                condition=Q(status="pending"),
                name="unique_pending_withdraw_per_seller"
            )
        ]

    def __str__(self):
        return f"{self.seller.shop_name} - {self.amount} - {self.status}"

