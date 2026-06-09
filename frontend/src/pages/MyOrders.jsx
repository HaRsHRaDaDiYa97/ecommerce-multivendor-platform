import { useEffect, useState } from "react";
import privateApi from "../api/privateApi";
import OrderCard from "../components/orders/OrderCard";
import { ShoppingBag, Package, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await privateApi.get("orders/my-orders/");
        if (isMounted) {
          setOrders(res?.data || []);
          setError("");
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
        if (isMounted) setError("Unable to load your orders.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrders();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8 animate-pulse pt-32">
        <div className="h-16 bg-gray-100 w-64 rounded-xl mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-gray-50 rounded-[2.5rem] w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        <p className="text-red-500 font-black uppercase tracking-widest mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-1">Try Again</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pt-10 pb-24 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-12 bg-black"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
                Dashboard
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              My <br />
              <span className="text-gray-300 italic">Orders</span>
            </h1>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              <Package size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Total Orders: {orders.length}
              </span>
            </div>
          </div>
        </div>

        {/* --- ORDERS GRID --- */}
        {orders.length === 0 ? (
          <div className="text-center py-32 bg-white border border-gray-100 rounded-[3rem] shadow-sm">
            <ShoppingBag className="mx-auto mb-6 text-gray-100" size={80} />
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Your Archive is Empty</h2>
            <Link to="/products" className="mt-6 inline-block text-[10px] font-black uppercase tracking-widest bg-black text-white px-10 py-5 rounded-full hover:bg-gray-800 transition-all">
              Discover Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-gray-400">
               <LayoutGrid size={16} />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">Purchase Catalog</p>
               <div className="flex-1 h-[1px] bg-gray-100"></div>
            </div>

            {/* TWO COLUMN GRID START */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {orders.map(order => (
    <OrderCard key={order.id} order={order} />
  ))}
</div>
          </div>
        )}
      </div>
    </div>
  );
}