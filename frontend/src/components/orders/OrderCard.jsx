// import { Link } from "react-router-dom";
// import StatusBadge from "./StatusBadge";
// import { ArrowRight } from "lucide-react";

// export default function OrderCard({ order }) {
//   // Logic Preserved
//   const firstItem = order.items?.[0];
//   const moreItems = (order.items?.length || 0) - 1;

//   const imageUrl = firstItem?.image
//     ? `http://127.0.0.1:8000${firstItem.image}`
//     : "/no-image.png";

//   const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });

//   return (
//     <div className="bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-sm">
      
//       {/* Top Bar: Order Info & Status */}
//       <div className="flex justify-between items-start pb-6 mb-6 border-b border-gray-50">
//         <div>
//           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Reference</p>
//           <h3 className="text-lg font-bold text-black">#{order.id}</h3>
//           <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
//         </div>
//         <StatusBadge status={order.order_status} />
//       </div>

//       {/* Main Content: Product Preview */}
//       <div className="flex items-center gap-5 mb-8">
//         <div className="relative">
//           <img
//             src={imageUrl}
//             alt={firstItem?.name}
//             className="w-20 h-20 object-cover rounded-xl border border-gray-100 bg-gray-50"
//           />
//           {moreItems > 0 && (
//             <div className="absolute -top-2 -right-2 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md border border-white">
//               +{moreItems}
//             </div>
//           )}
//         </div>

//         <div className="flex-1">
//           <p className="font-bold text-sm text-gray-900 line-clamp-1">
//             {firstItem?.name || "Product Item"}
//           </p>
//           <p className="text-xs text-gray-500 mt-1">
//             Qty: {firstItem?.quantity} × ₹{firstItem?.price}
//           </p>
//           {moreItems > 0 && (
//             <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-2 font-medium">
//               Multiple item shipment
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Footer: Price & Link */}
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</p>
//           <p className="text-xl font-bold text-black">₹{order.total_amount}</p>
//         </div>

//         <Link
//           to={`/orders/${order.id}`}
//           className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-black border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
//         >
//           View Details <ArrowRight size={14} />
//         </Link>
//       </div>

//     </div>
//   );
// }



import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { ArrowRight } from "lucide-react";

export default function OrderCard({ order }) {
  // Safe access for nested items
  const items = order?.items || [];
  const firstItem = items[0];
  const moreItems = items.length - 1;

  // Handle local vs production image URLs
  const imageUrl = firstItem?.image
    ? `http://127.0.0.1:8000${firstItem.image}`
    : "/no-image.png";

  // Formatted date (e.g., 16 Feb 2026)
  const formattedDate = order?.created_at 
    ? new Date(order.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : "Date N/A";

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-md">
      
      {/* Top Bar: Order Info & Status */}
      <div className="flex justify-between items-start pb-6 mb-6 border-b border-gray-50">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Reference</p>
          <h3 className="text-lg font-bold text-black group-hover:text-blue-600 transition-colors">
            #{order?.id || "0000"}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
        </div>
        <StatusBadge status={order?.order_status} />
      </div>

      {/* Main Content: Product Preview */}
      <div className="flex items-center gap-5 mb-8">
        <div className="relative flex-shrink-0">
          <img
            src={imageUrl}
            alt={firstItem?.name || "Product"}
            className="w-20 h-20 object-cover rounded-xl border border-gray-100 bg-gray-50 transition-transform duration-300 group-hover:scale-105"
          />
          {moreItems > 0 && (
            <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md border-2 border-white shadow-sm">
              +{moreItems}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 truncate">
            {firstItem?.name || "Product Item"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Qty: {firstItem?.quantity || 1} × ₹{Number(firstItem?.price).toLocaleString()}
          </p>
          {moreItems > 0 && (
            <p className="text-[10px] text-blue-500 uppercase tracking-wide mt-2 font-bold bg-blue-50 inline-block px-2 py-0.5 rounded-full">
              Multiple item shipment
            </p>
          )}
        </div>
      </div>

      {/* Footer: Price & Link */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</p>
          <p className="text-xl font-extrabold text-black">
            ₹{Number(order?.total_amount).toLocaleString()}
          </p>
        </div>

        <Link
          to={`/orders/${order?.id}`}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-black border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all active:scale-95"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
}