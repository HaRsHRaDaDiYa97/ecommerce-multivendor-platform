import { CheckCircle2, Package, Truck, Calendar, ShoppingBag, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function OrderSuccess({ orderId, onClose }) {
  const navigate = useNavigate();
  if (!orderId) return null;

  const today = new Date();
  const deliveryDate = new Date(today.setDate(today.getDate() + 5))
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 text-center overflow-hidden">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-black transition-all"
        >
          <X size={20} />
        </button>

        {/* Success Icon Section */}
        <div className="flex justify-center mb-6 pt-2">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
            <div className="relative bg-emerald-500 text-white p-5 rounded-full shadow-lg shadow-emerald-200">
              <CheckCircle2 size={42} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-2">Order Confirmed</h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-10">
          Ref ID: <span className="text-black">{orderId}</span>
        </p>

        {/* Delivery Info Box */}
        <div className="bg-[#fafafa] rounded-[1.5rem] p-6 mb-10 text-left border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-50">
              <Calendar className="text-black" size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Estimated Arrival</p>
              <p className="text-sm font-semibold text-gray-900">{deliveryDate}</p>
            </div>
          </div>
        </div>

        {/* Status Tracker Preview */}
        <div className="relative mb-12 px-2">
          <div className="flex justify-between relative z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shadow-md">
                <CheckCircle2 size={14} />
              </div>
              <span className="text-[8px] font-bold uppercase text-black tracking-widest">Ordered</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-25">
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                <Package size={14} />
              </div>
              <span className="text-[8px] font-bold uppercase text-gray-400 tracking-widest">Packed</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-25">
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                <Truck size={14} />
              </div>
              <span className="text-[8px] font-bold uppercase text-gray-400 tracking-widest">Shipped</span>
            </div>
          </div>
          {/* Progress Line */}
          <div className="absolute top-3.5 left-0 w-full h-[1px] bg-gray-100 -z-0" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => { onClose(); navigate("/my-orders"); }}
            className="flex-1 bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
          >
            Track Order
          </button>
          <button 
            onClick={() => { onClose(); navigate("/products"); }}
            className="flex-1 bg-white text-black border border-gray-100 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all active:scale-95"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}