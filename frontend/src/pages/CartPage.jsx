
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../features/cart/cartSlice";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, count, loading, error } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const totalPrice = cartItems.reduce(
      (sum, item) =>
        sum + (parseFloat(item.product.sale_price || item.product.price) * item.quantity),
      0
    );
    setTotal(totalPrice);
  }, [cartItems]);

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const item = cartItems.find(i => i.product.id === productId);
    if (!item) return;

    // Limit by stock
    if (newQuantity > item.product.stock) {
      toast.info(`Only ${item.product.stock} item(s) available in stock`);
      return;
    }
    if (newQuantity <= 0) return;

    // Update locally first for instant UI feedback
    dispatch(updateCartQuantity({ productId, quantity: newQuantity }));

    try {
      // Sync with backend
      await dispatch(updateCartQuantity({ productId, quantity: newQuantity })).unwrap();
    } catch {
      toast.error("Failed to update quantity");
    }
  };


  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please login to continue");
      navigate("/login");
    } else if (cartItems.length === 0) {
      toast.info("Cart is empty");
    } else {
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-sm underline uppercase tracking-widest">Retry</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-black mb-2">
              Shopping Cart
            </h1>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">
              {count} {count === 1 ? "Item" : "Items"} reserved in your bag
            </p>
          </div>
          <Link to="/products" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
            <ShoppingCart size={48} className="mx-auto text-gray-200 mb-6" />
            <p className="text-lg text-gray-400 font-medium mb-8">Your bag is currently empty.</p>
            <Link to="/products" className="inline-block bg-black text-white px-10 py-4 rounded-2xl text-[12px] font-semibold uppercase tracking-widest hover:opacity-80 transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* LEFT: ITEMS LIST */}
            <div className="lg:col-span-8 space-y-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-gray-50 last:border-0"
                >
                  {/* IMAGE */}
                  <div
                    className="relative w-full sm:w-32 h-40 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0"
                    onClick={() => navigate(`/products/${item.product.id}`)}
                  >
                    <img
                      src={
                        item.product.image
                          ? `http://127.0.0.1:8000${item.product.image}`
                          : item.product.images?.[0]
                            ? `http://127.0.0.1:8000${item.product.images[0].image}`
                            : "/placeholder.png"
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-grow space-y-1">
                    <h2 className="text-lg font-medium text-black hover:text-gray-500 transition-colors cursor-pointer" onClick={() => navigate(`/products/${item.product.id}`)}>
                      {item.product.name}
                    </h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                      {item.product.category?.name || "Premium Item"}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium mt-1">
                      {item.product.stock - item.quantity > 0
                        ? `Remaining: ${item.product.stock - item.quantity} item${item.product.stock - item.quantity > 1 ? "s" : ""}`
                        : `Maximum quantity in cart reached`}
                    </p>





                    <div className="pt-2">
                      <span className="text-lg font-medium">₹{item.product.sale_price || item.product.price}</span>
                    </div>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                    <div className="flex items-center border border-gray-100 rounded-full p-1 bg-gray-50/50">
                      {/* MINUS */}
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className={`p-2 rounded-full transition-colors ${item.quantity <= 1 ? "cursor-not-allowed opacity-50" : "hover:bg-white"}`}
                      >
                        <Minus size={14} className="text-gray-500" />
                      </button>

                      {/* PLUS */}
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className={`p-2 rounded-full transition-colors ${item.quantity >= item.product.stock ? "cursor-not-allowed opacity-50" : "hover:bg-white"}`}
                      >
                        <Plus size={14} className={`text-gray-500 ${item.quantity >= item.product.stock ? 'text-gray-300' : ''}`} />
                      </button>



                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-semibold">₹{(parseFloat(item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => dispatch(clearCart())}
                className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
              >
                Clear All Items
              </button>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="lg:col-span-4">
              <div className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100 sticky top-28">
                <h2 className="text-xl font-medium mb-8">Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="text-black font-semibold">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Estimated Shipping</span>
                    <span className="text-emerald-600 font-semibold uppercase text-[10px]">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                    <span className="text-gray-900 font-medium">Total</span>
                    <div className="text-right">
                      <p className="text-2xl font-semibold tracking-tight">₹{total.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">VAT Included</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white h-16 rounded-2xl font-semibold uppercase tracking-[0.2em] text-[12px] hover:opacity-90 transition-all shadow-xl shadow-black/10 mb-6"
                >
                  Secure Checkout
                </button>

                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Safe & Encrypted</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}





