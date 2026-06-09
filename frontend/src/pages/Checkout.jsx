import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import privateApi from "../api/privateApi";
import { fetchAddresses, selectAddress } from "../features/auth/addressSlice";
import AddressList from "../components/address/AddressList";
import AddressForm from "../components/address/AddressForm";

import { fetchCart } from "../features/cart/cartSlice";
import {
  CreditCard,
  Truck,
  MapPin,
  ShoppingBag,
  Plus,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  Loader2
} from "lucide-react";
import OrderSuccess from "./OrderSuccess";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, defaultAddress } = useSelector((state) => state.address);
  const { items: cartItems } = useSelector((state) => state.cart);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);

const [successOrderId, setSuccessOrderId] = useState(null);

// console.log(cartItems);


  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (list?.length) {
      const defaultAddr = list.find(addr => addr.is_default);
      if (defaultAddr) dispatch(selectAddress(defaultAddr));
    }
  }, [list, dispatch]);

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + parseFloat(item.product.sale_price || item.product.price) * item.quantity,
    0
  ) || 0;

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const setDefaultAddress = async (addr) => {
    try {
      await privateApi.patch(`users/addresses/${addr.id}/`, { is_default: true });
      dispatch(fetchAddresses());
    } catch (err) {
      alert("Failed to set default address");
    }
  };

  const saveAddress = async (data) => {
    try {
      if (editingAddress) {
        await privateApi.patch(`users/addresses/${editingAddress.id}/`, data);
      } else {
        await privateApi.post("users/addresses/add/", data);
      }
      dispatch(fetchAddresses());
      setShowForm(false);
      setEditingAddress(null);
    } catch (err) {
      alert("Address error");
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    await privateApi.delete(`users/addresses/${id}/`);
    dispatch(fetchAddresses());
  };



  const placeOrderHandler = async () => {
    if (!defaultAddress) {
      alert("Please select a delivery address");
      return;
    }

    try {
      setPlacing(true);

      const availableCartItems = cartItems.filter(
        (item) => (item.product.stock || 0) > 0
      );

      if (availableCartItems.length === 0) {
        alert("All items in your cart are out of stock!");
        return;
      }

      const cartPayload = availableCartItems.map((item) => ({
        product_id: item.product.id,
        qty: Math.min(item.quantity, item.product.stock),
        price: parseFloat(item.product.sale_price || item.product.price),
      }));

      const orderData = {
        address_id: defaultAddress.id,
        amount: cartPayload.reduce(
          (acc, item) => acc + item.qty * item.price,
          0
        ),
        cart: cartPayload
      };



      const endpoint =
        paymentMethod === "COD"
          ? "orders/cod-create/"
          : "orders/create-payment-order/";

      const { data } = await privateApi.post(endpoint, orderData);

      if (paymentMethod === "COD") {
        await dispatch(fetchCart());
        setSuccessOrderId(data.order_id);

      }
      else {
        const options = {
          key: data.razorpay_key,
          amount: data.amount,
          currency: "INR",
          name: "Elite Store",
          description: "Order Payment",
          order_id: data.razorpay_order_id,
          handler: async function (response) {
            try {
              const verifyData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                ...orderData,
              };

              const verifyRes = await privateApi.post(
                "orders/verify-payment/",
                verifyData
              );

              await dispatch(fetchCart());
           setSuccessOrderId(verifyRes.data.order_id);


            } catch (err) {
              console.error(err);
              alert("Payment verification failed");
            }
          },
          prefill: {
            name: defaultAddress.name,
            contact: defaultAddress.phone_number
          },

          theme: { color: "#000000" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert("Order failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

        {/* HEADER SECTION */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">Secure Checkout</h1>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <ShoppingBag size={14} /> {cartItems.length} Items in Bag
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ================= LEFT SIDE (STEP-BY-STEP) ================= */}
          <div className="lg:col-span-8 space-y-8">

            {/* STEP 1: ADDRESS */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">1</div>
                  <h2 className="text-xl font-medium tracking-tight">Delivery Address</h2>
                </div>
                {!showForm && (
                  <button
                    onClick={() => { setShowForm(true); setEditingAddress(null); }}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    <Plus size={14} /> Add New
                  </button>
                )}
              </div>

              {showForm ? (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <AddressForm
                    onSave={saveAddress}
                    editingAddress={editingAddress}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              ) : (
                <AddressList
                  addresses={list}
                  selected={defaultAddress}
                  onSelect={setDefaultAddress} // ⚡️ call new function
                  onEdit={(addr) => { setEditingAddress(addr); setShowForm(true); }}
                  onDelete={deleteAddress}
                />
              )}
            </div>

            {/* STEP 2: PAYMENT */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="text-xl font-medium tracking-tight">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === "COD" ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD" ? "border-black" : "border-gray-300"}`}>
                    {paymentMethod === "COD" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive</p>
                  </div>
                  <Truck className="ml-auto text-gray-400" size={20} />
                </div>

                {/* RAZORPAY Option */}
                <div
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === "RAZORPAY" ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "RAZORPAY" ? "border-black" : "border-gray-300"}`}>
                    {paymentMethod === "RAZORPAY" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Online Payment</p>
                    <p className="text-xs text-gray-500">Razorpay Secure Checkout</p>
                  </div>
                  <CreditCard className="ml-auto text-gray-400" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE (ORDER SUMMARY) ================= */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl sticky top-20">
              <h2 className="text-xl font-medium tracking-tight mb-8">Order Summary</h2>

              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
  <div key={item.id} className="flex gap-4">
    <div className="relative">
      <img
        src={`${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}${item.product.images && item.product.images.length > 0 ? item.product.images[0].image : "/fallback.jpg"}`}
        alt={item.product.name}
        className="w-16 h-20 object-cover rounded-xl bg-gray-50"
      />
      <span className="absolute top-1 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
        {item.quantity}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm text-gray-900 truncate">{item.product.name}</p>
      <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
      <p className="font-bold text-sm mt-2">₹{(parseFloat(item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}</p>
    </div>
  </div>
))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-emerald-600">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-4">
                  <span className="font-medium tracking-tight">Total</span>
                  <span className="font-bold tracking-tighter">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={placeOrderHandler}
                disabled={placing}
                className="mt-8 w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-[0.98] disabled:bg-gray-200"
              >
                {placing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Order
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" /> Secure SSL Encryption
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <PackageCheck size={14} className="text-emerald-500" /> Authentic Elite Products
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
       {/* ✅ ADD MODAL HERE (outside inner container) */}
      <OrderSuccess
        orderId={successOrderId}
        onClose={() => setSuccessOrderId(null)}
      />

    </div>
  );
}