// import { useEffect, useState } from "react";
// import { getSellerOrders, updateItemStatus } from "../api/sellerApi";
// import { Package, User, MapPin, DollarSign, Clock, CheckCircle } from "lucide-react";

// export default function SellerOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const data = await getSellerOrders();
//       setOrders(data);
//       console.log("SELLER ORDERS:", data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (itemId, status) => {
//     try {
//       await updateItemStatus(itemId, status);
//       fetchOrders();
//     } catch (err) {
//       console.error(err.response?.data || err);
//       alert(err.response?.data?.error || "Failed to update status");
//     }
//   };

//   const ALLOWED_TRANSITIONS = {
//     PLACED: ["CONFIRMED", "CANCELLED"],
//     CONFIRMED: ["PACKED", "CANCELLED"],
//     PACKED: ["SHIPPED"],
//     SHIPPED: ["OUT_FOR_DELIVERY"],
//     OUT_FOR_DELIVERY: ["DELIVERED"],
//     DELIVERED: ["RECEIVED", "RETURN_REQUESTED"],
//     RECEIVED: [],
//     RETURN_REQUESTED: ["RETURNED", "RETURN_REJECTED"],
//     RETURN_REJECTED: ["DELIVERED"],
//     CANCELLED: [],
//   };

//   // count real shipments (items not orders)
//   const totalItems = orders.reduce((t, o) => t + o.products.length, 0);

//   if (loading)
//     return (
//       <div className="max-w-6xl mx-auto p-10 pt-32 space-y-4 animate-pulse">
//         <div className="h-10 bg-gray-100 w-64 rounded-xl"></div>
//         <div className="h-64 bg-gray-50 rounded-[2rem]"></div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#FAFAFA] pb-20 px-4 md:px-10">
//       <div className="max-w-6xl mx-auto">

//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
//           <div>
//             <h1 className="text-4xl font-black uppercase tracking-tighter text-black">
//               Seller <span className="text-gray-400 italic">Dashboard</span>
//             </h1>
//             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">
//               Order Fulfillment Center
//             </p>
//           </div>
//           <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
//             <Package size={18} className="text-emerald-500" />
//             <span className="text-sm font-bold uppercase tracking-tight">
//               {totalItems} Active Shipments
//             </span>
//           </div>
//         </div>

//         {totalItems === 0 ? (
//           <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
//             <CheckCircle className="mx-auto mb-4 text-gray-100" size={60} />
//             <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
//               All caught up!
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-6">

//             {/* IMPORTANT: loop orders → products */}
//             {orders.map((order) =>
//               order.products.map((item) => {
//                 const allowedNext =
//                   ALLOWED_TRANSITIONS[item.status?.toUpperCase()] || [];

//                 return (
//                   <div
//                     key={`${order.order_id}-${item.item_id}`}
//                     className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-8 hover:shadow-xl hover:border-black transition-all duration-500 group"
//                   >
//                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

//                       {/* Product & Customer */}
//                       <div className="lg:col-span-4 space-y-4">
//                         <div>
//                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
//                             Product
//                           </p>
//                           <h2 className="text-lg font-black text-black uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
//                             {item.product} (x{item.quantity})
//                           </h2>
//                         </div>
//                         <div className="flex items-center gap-2 text-gray-500">
//                           <User size={14} />
//                           <span className="text-xs font-bold uppercase tracking-wide">
//                             {order.customer}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Address & Price */}
//                       <div className="lg:col-span-4 border-l border-gray-50 pl-0 lg:pl-8 space-y-3">
//                         <div className="flex items-start gap-3">
//                           <MapPin size={16} className="text-gray-300 mt-1 shrink-0" />
//                           <p className="text-xs text-gray-500 leading-relaxed font-medium">
//                             {order.address}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <DollarSign size={16} className="text-emerald-500" />
//                           <p className="text-base font-black tracking-tighter">
//                             ₹{item.price}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Status & Actions */}
//                       <div className="lg:col-span-4 flex flex-col sm:flex-row items-center justify-end gap-4 bg-gray-50 p-6 rounded-3xl group-hover:bg-gray-100 transition-colors">
//                         <div className="w-full sm:w-auto">
//                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center sm:text-left flex items-center gap-2">
//                             <Clock size={10} /> Current: {item.status}
//                           </p>

//                           <select
//                             className="w-full bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
//                             defaultValue=""
//                             onChange={(e) =>
//                               handleStatusChange(item.item_id, e.target.value)
//                             }
//                           >
//                             <option value="" disabled>
//                               Change Status
//                             </option>
//                             {allowedNext.map((status) => (
//                               <option key={status} value={status}>
//                                 {status.replaceAll("_", " ")}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                       </div>

//                     </div>
//                   </div>
//                 );
//               })
//             )}

//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { getSellerOrders, updateItemStatus } from "../api/sellerApi";
import { Package, User, MapPin, DollarSign, Clock, CheckCircle, ChevronRight } from "lucide-react";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getSellerOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId, status) => {
    try {
      await updateItemStatus(itemId, status);
      fetchOrders();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const ALLOWED_TRANSITIONS = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PACKED", "CANCELLED"],
    PACKED: ["SHIPPED"],
    SHIPPED: ["OUT_FOR_DELIVERY"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: ["RECEIVED", "RETURN_REQUESTED"],
    RECEIVED: [],
    RETURN_REQUESTED: ["RETURNED", "RETURN_REJECTED"],
    RETURN_REJECTED: ["DELIVERED"],
    CANCELLED: [],
  };

  const totalItems = orders.reduce((t, o) => t + o.products.length, 0);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6 pt-32 space-y-6 animate-pulse">
        <div className="h-12 bg-gray-100 w-64 rounded-2xl"></div>
        <div className="h-48 bg-gray-50 rounded-[2.5rem] w-full"></div>
        <div className="h-48 bg-gray-50 rounded-[2.5rem] w-full"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[2px] w-8 bg-black"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Logistics</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
              Orders <span className="text-gray-300 italic">Queue</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-gray-100 shadow-sm self-start">
            <div className="bg-black p-3 rounded-xl text-white">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Inventory</p>
              <p className="text-sm font-black uppercase">{totalItems} Items to Process</p>
            </div>
          </div>
        </div>

        {totalItems === 0 ? (
          <div className="bg-white rounded-[3rem] py-32 text-center border border-dashed border-gray-200">
            <CheckCircle className="mx-auto mb-4 text-emerald-500" size={48} />
            <h2 className="text-xl font-black uppercase tracking-tight">Queue Clear</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">No pending shipments found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) =>
              order.products.map((item) => {
                const allowedNext = ALLOWED_TRANSITIONS[item.status?.toUpperCase()] || [];

                return (
                  <div
                    key={`${order.order_id}-${item.item_id}`}
                    className="group bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-8 hover:shadow-2xl hover:border-black transition-all duration-500 overflow-hidden relative"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                      {/* Info Block: Product & User */}
                      <div className="lg:col-span-5 space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-500 shrink-0">
                            <Package size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">SKU Item</p>
                            <h2 className="text-lg md:text-xl font-black text-black uppercase tracking-tight leading-tight">
                              {item.product} <span className="text-emerald-500 ml-1">×{item.quantity}</span>
                            </h2>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 pl-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User size={14} className="text-gray-400" />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">
                            Customer: <span className="text-black">{order.customer}</span>
                          </span>
                        </div>
                      </div>

                      {/* Detail Block: Address & Price */}
                      <div className="lg:col-span-4 flex flex-col justify-center space-y-4 lg:border-l lg:border-gray-50 lg:pl-8">
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-gray-300 mt-0.5 shrink-0" />
                          <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-tight">
                            {order.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 bg-emerald-50 rounded-lg">
                            <p className="text-lg font-black tracking-tighter text-emerald-600">₹{item.price}</p>
                          </div>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Final Price</span>
                        </div>
                      </div>

                      {/* Action Block: Status Selector */}
                      <div className="lg:col-span-3">
                        <div className="bg-gray-50 rounded-[2rem] p-5 group-hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                              <Clock size={12} className="text-gray-400" />
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                              item.status === 'CANCELLED' ? 'border-red-200 text-red-500' : 'border-black text-black'
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          <div className="relative">
                            <select
                              className="w-full bg-white border border-gray-200 text-[11px] font-black uppercase tracking-widest px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black appearance-none transition-all cursor-pointer pr-10 shadow-sm"
                              defaultValue=""
                              onChange={(e) => handleStatusChange(item.item_id, e.target.value)}
                            >
                              <option value="" disabled>Change Status</option>
                              {allowedNext.map((status) => (
                                <option key={status} value={status}>
                                  {status.replaceAll("_", " ")}
                                </option>
                              ))}
                            </select>
                            <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                          </div>
                        </div>
                      </div>

                    </div>
                    {/* Background Detail for UX */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none hidden lg:block">
                       <p className="text-8xl font-black">#{order.order_id}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}