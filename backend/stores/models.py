from django.db import models
from django.utils.text import slugify
from users.models import SellerProfile

from users.models import User


class Store(models.Model):
    seller = models.OneToOneField(
        SellerProfile,
        on_delete=models.CASCADE,
        related_name="store"
    )

    # public branding
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)

    logo = models.ImageField(upload_to="store/logo/", null=True, blank=True)
    banner = models.ImageField(upload_to="store/banner/", null=True, blank=True)

    description = models.TextField(blank=True)
    tagline = models.CharField(max_length=255, blank=True)

    support_email = models.EmailField(blank=True)
    support_phone = models.CharField(max_length=15, blank=True)

    # rating cache
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.PositiveIntegerField(default=0)

    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name




class StoreReview(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    rating = models.IntegerField()  # 1 to 5
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("store", "user")  # one review per user

    def __str__(self):
        return f"{self.user.email} → {self.store.name} ({self.rating})"



class StoreFollower(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following_stores")
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="followers")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "store")

    def __str__(self):
        return f"{self.user.email} follows {self.store.name}"