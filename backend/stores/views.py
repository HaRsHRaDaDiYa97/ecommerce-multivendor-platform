from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import Store
from .serializers import PublicStoreSerializer

from .serializers import SellerStoreSerializer
from .utils import get_seller_store
from .serializers import FollowedStoreSerializer

from .models import StoreFollower

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import Store, StoreReview
from .serializers import CreateStoreReviewSerializer
from .permissions import has_purchased_store



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_store(request):
    seller_profile = request.user.seller_profile

    if hasattr(seller_profile, "store"):
        return Response({"message": "Store already exists"})

    store = Store.objects.create(
        seller=seller_profile,
        name=request.data.get("name"),
        support_email=request.data.get("support_email", ""),
        support_phone=request.data.get("support_phone", "")
    )

    return Response({
        "message": "Store created successfully",
        "store": store.name
    })



@api_view(["GET"])
def public_store_detail(request, slug):
    try:
        store = Store.objects.select_related("seller__user").get(slug=slug)
    except Store.DoesNotExist:
        raise NotFound("Store not found")

    serializer = PublicStoreSerializer(store)
    return Response(serializer.data)






@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_store_review(request, slug):
    try:
        store = Store.objects.get(slug=slug)
    except Store.DoesNotExist:
        raise NotFound("Store not found")

    # 🔥 DEBUG START
    print("Request User:", request.user)
    print("Request User ID:", request.user.id)
    print("Store:", store)

    from orders.models import OrderItem
    items = OrderItem.objects.filter(order__user=request.user)
    print("User Orders Count:", items.count())

    for i in items:
        print("OrderItem → Product:", i.product.name)
        print("OrderItem → Store:", i.product.store)
        print("OrderItem → Status:", i.item_status)
    # 🔥 DEBUG END

    # check purchase
    if not has_purchased_store(request.user, store):
        raise PermissionDenied("You can only review stores you purchased from")

    # prevent duplicate review
    if StoreReview.objects.filter(store=store, user=request.user).exists():
        raise PermissionDenied("You already reviewed this store")

    serializer = CreateStoreReviewSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    serializer.save(user=request.user, store=store)

    return Response({"message": "Review added successfully"})





@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def seller_store_me(request):
    store = get_seller_store(request.user)

    # GET → fetch store
    if request.method == "GET":
        serializer = SellerStoreSerializer(store)
        return Response(serializer.data)

    # PATCH → update store
    serializer = SellerStoreSerializer(store, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response({"message": "Store updated successfully"})





@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_follow_store(request, slug):
    try:
        store = Store.objects.get(slug=slug)
    except Store.DoesNotExist:
        raise NotFound("Store not found")

    obj, created = StoreFollower.objects.get_or_create(
        user=request.user,
        store=store
    )

    if not created:
        obj.delete()
        return Response({"following": False, "message": "Unfollowed store"})

    return Response({"following": True, "message": "Store followed"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_following_stores(request):
    stores = Store.objects.filter(followers__user=request.user)

    serializer = FollowedStoreSerializer(stores, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def store_followers_count(request, slug):
    try:
        store = Store.objects.get(slug=slug)
    except Store.DoesNotExist:
        raise NotFound("Store not found")

    count = store.followers.count()

    return Response({"followers": count})
