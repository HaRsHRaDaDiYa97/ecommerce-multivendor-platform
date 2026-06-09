from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import UserAddress
from .serializers import AddressSerializer


# ================= GET ALL ADDRESSES =================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_addresses(request):
    addresses = UserAddress.objects.filter(user=request.user).order_by("-is_default", "-created_at")
    serializer = AddressSerializer(addresses, many=True)

    default_address = addresses.filter(is_default=True).first()

    return Response({
        "addresses": serializer.data,
        "default_address": AddressSerializer(default_address).data if default_address else None
    })


# ================= ADD ADDRESS =================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_address(request):

    # Limit protection
    if UserAddress.objects.filter(user=request.user).count() >= 10:
        return Response({"error": "Maximum 10 addresses allowed"}, status=400)

    serializer = AddressSerializer(data=request.data)

    if serializer.is_valid():

        # if new address is default → remove previous default
        if serializer.validated_data.get("is_default"):
            UserAddress.objects.filter(user=request.user).update(is_default=False)

        address = serializer.save(user=request.user)

        return Response(AddressSerializer(address).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ================= UPDATE + DELETE (SINGLE ENDPOINT) =================
@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def address_detail(request, id):

    try:
        address = UserAddress.objects.get(id=id, user=request.user)
    except UserAddress.DoesNotExist:
        return Response({"error": "Address not found"}, status=404)

    # -------- UPDATE ADDRESS --------
    if request.method == "PATCH":
        serializer = AddressSerializer(address, data=request.data, partial=True)

        if serializer.is_valid():

            if serializer.validated_data.get("is_default"):
                UserAddress.objects.filter(user=request.user).exclude(id=id).update(is_default=False)

            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    # -------- DELETE ADDRESS --------
    if request.method == "DELETE":
        was_default = address.is_default
        deleted_id = address.id
        address.delete()

        # if default deleted → make newest default
        if was_default:
            new_default = UserAddress.objects.filter(user=request.user).order_by("-created_at").first()
            if new_default:
                new_default.is_default = True
                new_default.save()

        return Response({
            "message": "Address deleted",
            "id": deleted_id
        })
