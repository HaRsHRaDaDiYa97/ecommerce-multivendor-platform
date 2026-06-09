from django.contrib import admin
from .models import ContactMessage
from django.core.mail import send_mail
from django.utils import timezone

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at", "replied_at")
    readonly_fields = ("name", "email", "subject", "message", "created_at")

    # Add reply field in admin
    fields = ("name", "email", "subject", "message", "reply", "replied_at", "created_at")

    # Save model to send email when admin replies
    def save_model(self, request, obj, form, change):
        if obj.reply and not obj.replied_at:
            obj.replied_at = timezone.now()
            send_mail(
                subject=f"Reply to your message: {obj.subject}",
                message=obj.reply,
                from_email="harshradadiya97@gmail.com",  # Replace with your email
                recipient_list=[obj.email],
                fail_silently=False,
            )
        super().save_model(request, obj, form, change)
