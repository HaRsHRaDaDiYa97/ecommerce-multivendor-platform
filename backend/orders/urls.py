from django.urls import path

# Payment
from .payment_views import create_payment_order, verify_payment,create_cod_order

# Customer
from .customer_views import  customer_orders, mark_item_received,request_item_return

# Seller
from .seller_views import (
    seller_update_item_status,
    seller_orders,
    seller_orders_by_status,
    seller_earnings,
    seller_return_requests,
    seller_handle_return_request,
    seller_dashboard_stats,
)

# Tracking
from .tracking_views import get_order_tracking
from .seller_withdraw import create_withdraw_request

from .admin_wallet_views import (
    admin_withdraw_requests,
    admin_approve_withdraw,
    admin_reject_withdraw
)


urlpatterns = [
    # PAYMENT
    path("create-payment-order/", create_payment_order, name="create_payment_order"),
    path("verify-payment/", verify_payment, name="verify_payment"),

    # COD
    path("cod-create/", create_cod_order, name="cod_create"),

    # TRACKING
    path("track/<int:order_id>/", get_order_tracking),

    # CUSTOMER
    path("my-orders/", customer_orders),
    path("my-orders/item/<int:item_id>/received/", mark_item_received, name="mark_item_received"),
    path("my-orders/item/<int:item_id>/return/", request_item_return, name="request_item_return"),


    # SELLER
    path("seller/item/<int:item_id>/status/", seller_update_item_status),
    path("seller/dashboard/", seller_dashboard_stats),
    path("seller/orders/", seller_orders),
    path("seller/orders/<str:status>/", seller_orders_by_status),
    path("seller/earnings/", seller_earnings),
    path("seller/returns/", seller_return_requests, name="seller_return_requests"),
    path("seller/return/<int:item_id>/", seller_handle_return_request, name="seller_handle_return"),
    
    path("seller/withdraw/", create_withdraw_request),

    path("admin/withdraws/", admin_withdraw_requests),
    path("admin/withdraws/<int:withdraw_id>/approve/", admin_approve_withdraw),
    path("admin/withdraws/<int:withdraw_id>/reject/", admin_reject_withdraw),       


]
