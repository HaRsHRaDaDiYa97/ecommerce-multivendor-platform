from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({
        "status": "healthy",
        "message": "Multi-Vendor E-Commerce REST API is live!"
    })

urlpatterns = [
    path('', root_view),
    path('admin/', admin.site.urls),
    # Routes for apps
    path('api/users/', include('users.urls')), 
    path('api/products/', include('products.urls')),
    path('api/reviews/', include('reviews.urls')),
    path("api/cart/", include("cart.urls")),
    path("api/wishlist/", include("wishlist.urls")),
    path("api/contact/", include("contact.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/stores/", include("stores.urls")),


]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
