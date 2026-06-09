from django.db.models import Avg, Count
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import StoreReview


def update_store_rating(store):
    stats = store.reviews.aggregate(
        avg=Avg("rating"),
        total=Count("id")
    )

    store.rating = stats["avg"] or 0
    store.total_reviews = stats["total"]
    store.save(update_fields=["rating", "total_reviews"])


@receiver(post_save, sender=StoreReview)
def review_saved(sender, instance, **kwargs):
    update_store_rating(instance.store)


@receiver(post_delete, sender=StoreReview)
def review_deleted(sender, instance, **kwargs):
    update_store_rating(instance.store)
