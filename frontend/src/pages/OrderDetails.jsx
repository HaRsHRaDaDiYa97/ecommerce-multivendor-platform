import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import privateApi from "../api/privateApi";
import OrderTimeline from "../components/orders/OrderTimeline";
import OrderItemCard from "../components/orders/OrderItemCard";
import { ArrowLeft, CreditCard, Box, Hash } from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await privateApi.get(`orders/track/${id}/`);
      setOrder(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto p-6 pt-32 animate-pulse space-y-8">
      <div className="h-12 bg-gray-100 w-1/3 rounded-xl"></div>
      <div className="h-32 bg-gray-50 rounded-[2rem]"></div>
    </div>
  );

  if (error) return <div className="p-20 text-center font-bold uppercase tracking-widest text-red-500">{error}</div>;
  if (!order) return <div className="p-20 text-center font-bold uppercase tracking-widest">Order not found</div>;

  return (
    <div className="min-h-screen bg-white pt-10 pb-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Header */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-8 hover:opacity-50 transition-all"
        >
          <ArrowLeft size={14} /> Back to Orders
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">
              Track <span className="text-gray-300 italic">Order</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Reference: <span className="text-black">#{order.id}</span>
            </p>
          </div>
          <div className="bg-black text-white px-8 py-4 rounded-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1">Total Amount</p>
            <p className="text-2xl font-black tracking-tighter">₹{order.total_amount ?? 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Info & Items */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                <div className="flex items-center gap-3 mb-4 text-gray-400">
                  <CreditCard size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Payment</span>
                </div>
                <p className="font-black uppercase tracking-tight">{order.payment_method || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                <div className="flex items-center gap-3 mb-4 text-gray-400">
                  <Box size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Order Status</span>
                </div>
                <p className="font-black uppercase tracking-tight text-emerald-600">
                  {order.order_status?.replaceAll("_", " ")}
                </p>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Hash size={14} /> Parcel Contents
              </h3>
              {(order.items || []).map((item) => (
                <OrderItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
               <OrderTimeline tracking={order.tracking || []} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}