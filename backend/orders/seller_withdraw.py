from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from decimal import Decimal  # <-- IMPORT DECIMAL

from users.models import SellerProfile
from .models import SellerWallet, SellerWithdrawRequest
from .serializers import SellerWithdrawRequestSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_withdraw_request(request):
    user = request.user

    # Check seller
    seller = SellerProfile.objects.filter(user=user).first()
    if not seller:
        return Response({"error": "You are not a seller"}, status=403)

    wallet, _ = SellerWallet.objects.get_or_create(seller=seller)

    amount = request.data.get("amount")

    try:
        # Convert safely to Decimal to avoid float + Decimal errors
        amount = Decimal(str(amount))
    except:
        return Response({"error": "Invalid amount"}, status=400)

    if amount <= 0:
        return Response({"error": "Amount must be greater than zero"}, status=400)

    # prevent multiple pending requests
    if SellerWithdrawRequest.objects.filter(seller=seller, status="pending").exists():
        return Response({"error": "You already have a pending withdraw request"}, status=400)

    # check balance
    if wallet.available_balance < amount:
        return Response({"error": "Insufficient available balance"}, status=400)

    # LOCK MONEY
    with transaction.atomic():
        wallet.available_balance -= amount
        wallet.withdrawn_balance += amount
        wallet.save()

        withdraw = SellerWithdrawRequest.objects.create(
            seller=seller,
            wallet=wallet,
            amount=amount
        )

    serializer = SellerWithdrawRequestSerializer(withdraw)

    return Response({
        "message": "Withdraw request submitted successfully",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)
