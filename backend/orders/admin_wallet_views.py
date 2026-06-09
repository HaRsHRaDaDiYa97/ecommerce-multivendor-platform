from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from .models import SellerWithdrawRequest, SellerWallet


# =========================
# 📄 GET ALL WITHDRAW REQUESTS
# =========================
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_withdraw_requests(request):
    requests = SellerWithdrawRequest.objects.select_related("seller__user").order_by("-requested_at")

    data = []
    for r in requests:
        data.append({
            "id": r.id,
            "seller": r.seller.shop_name,
            "seller_email": r.seller.user.email,
            "amount": float(r.amount),
            "status": r.status,
            "requested_at": r.requested_at,
            "processed_at": r.processed_at,
            "admin_note": r.admin_note,
        })

    return Response(data)


# =========================
# ✅ APPROVE WITHDRAW
# =========================
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_approve_withdraw(request, withdraw_id):
    try:
        withdraw = SellerWithdrawRequest.objects.select_related("seller").get(id=withdraw_id)

        # ❌ Already processed
        if withdraw.status != "pending":
            return Response({"error": "Already processed"}, status=400)

        admin_note = request.data.get("admin_note", "")

        with transaction.atomic():

            # ✅ Ensure wallet exists
            wallet, created = SellerWallet.objects.get_or_create(
                seller=withdraw.seller,
                defaults={
                    "available_balance": 0,
                    "withdrawn_balance": 0
                }
            )

            # ⚠️ Safety check
            if wallet.withdrawn_balance < withdraw.amount:
                return Response({"error": "Invalid withdraw amount"}, status=400)

            # ✅ Approve withdraw
            withdraw.status = "approved"
            withdraw.processed_at = timezone.now()
            withdraw.admin_note = admin_note
            withdraw.save(update_fields=["status", "processed_at", "admin_note"])

        return Response({"message": "Withdraw approved successfully"})

    except SellerWithdrawRequest.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)


# =========================
# ❌ REJECT WITHDRAW
# =========================
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_reject_withdraw(request, withdraw_id):
    try:
        withdraw = SellerWithdrawRequest.objects.select_related("seller").get(id=withdraw_id)

        # ❌ Already processed
        if withdraw.status != "pending":
            return Response({"error": "Already processed"}, status=400)

        admin_note = request.data.get("admin_note", "")

        with transaction.atomic():

            # ✅ Ensure wallet exists
            wallet, created = SellerWallet.objects.get_or_create(
                seller=withdraw.seller,
                defaults={
                    "available_balance": 0,
                    "withdrawn_balance": 0
                }
            )

            # 🔁 Refund logic
            wallet.available_balance += withdraw.amount
            wallet.withdrawn_balance -= withdraw.amount
            wallet.save(update_fields=["available_balance", "withdrawn_balance"])

            # ❌ Reject withdraw
            withdraw.status = "rejected"
            withdraw.processed_at = timezone.now()
            withdraw.admin_note = admin_note
            withdraw.save(update_fields=["status", "processed_at", "admin_note"])

        return Response({"message": "Withdraw rejected successfully"})

    except SellerWithdrawRequest.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)