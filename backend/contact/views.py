from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings

# 1️⃣ Create message (used by public)
class ContactMessageCreateAPIView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

# 2️⃣ List messages (used by admin)
class ContactMessageListAPIView(generics.ListAPIView):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminUser]

# 3️⃣ Reply to message (used by admin)
class ContactMessageReplyAPIView(generics.UpdateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminUser]
    lookup_url_kwarg = 'pk'

    def update(self, request, *args, **kwargs):
        message = self.get_object()
        reply_text = request.data.get("reply")

        if not reply_text:
            return Response({"error": "Reply is required"}, status=status.HTTP_400_BAD_REQUEST)

        message.reply = reply_text
        message.status = "replied"
        message.replied_at = timezone.now()
        message.save()

        send_mail(
            subject=f"Reply to your message: {message.subject}",
            message=reply_text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[message.email],
            fail_silently=False,
        )

        return Response(ContactMessageSerializer(message).data)


class ContactMessageDeleteAPIView(generics.DestroyAPIView):
    queryset = ContactMessage.objects.all()
    permission_classes = [IsAdminUser]
    lookup_url_kwarg = "pk"
