from django.utils import timezone
from .models import SellerTransaction, SellerWallet

def release_seller_payments():
    now = timezone.now()

    transactions = SellerTransaction.objects.filter(
        status="pending",
        release_date__lte=now
    )

    for tx in transactions:
        wallet, created = SellerWallet.objects.get_or_create(seller=tx.seller)

        wallet.pending_balance = max(wallet.pending_balance - tx.seller_earning, 0)
        wallet.available_balance += tx.seller_earning
        wallet.save(update_fields=["pending_balance", "available_balance"])


        tx.status = "available"
        tx.save()

    return f"{transactions.count()} payments released"
