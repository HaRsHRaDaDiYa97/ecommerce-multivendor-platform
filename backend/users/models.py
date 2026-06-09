from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = (
        ('USER', 'User'),
        ('SELLER', 'Seller'),
        ('ADMIN', 'Admin'),
    )

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='USER'
    )

    # 👇 seller workflow
    seller_requested = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return f"{self.email} ({self.role})"



# users/models.py
class SellerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller_profile')
    shop_name = models.CharField(max_length=255)
    business_address = models.TextField()
    tax_id = models.CharField(max_length=50)  # e.g., GST or VAT number
    phone_number = models.CharField(max_length=15)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.shop_name
    
    
    
class UserAddress(models.Model):
    ADDRESS_TYPE = (
        ("HOME", "Home"),
        ("OFFICE", "Office"),
        ("OTHER", "Other"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="addresses"
    )

    label = models.CharField(max_length=50)  # Custom name like "My Home", "Rajkot Flat"
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPE, default="HOME")

    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15)

    address_line = models.TextField()
    landmark = models.CharField(max_length=150, blank=True)
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=120)
    pincode = models.CharField(max_length=10)

    is_default = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.label} - {self.city}"
