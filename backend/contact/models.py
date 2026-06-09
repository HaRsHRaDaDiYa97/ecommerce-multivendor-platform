from django.db import models
from django.utils import timezone

class ContactMessage(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("replied", "Replied"),
    )

    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=150)
    message = models.TextField()

    reply = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")

    created_at = models.DateTimeField(default=timezone.now)
    replied_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"
