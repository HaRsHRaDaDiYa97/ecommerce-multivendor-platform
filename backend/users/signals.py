from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SellerProfile
from stores.models import Store


@receiver(post_save, sender=SellerProfile)
def create_store_for_approved_seller(sender, instance, created, **kwargs):
    if kwargs.get('raw', False):
        return
    if instance.is_approved:
        Store.objects.get_or_create(
            seller=instance,
            defaults={"name": instance.shop_name}
        )
