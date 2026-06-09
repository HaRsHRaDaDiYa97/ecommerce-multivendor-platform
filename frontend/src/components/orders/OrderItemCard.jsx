
import StatusBadge from "./StatusBadge";
import { Link } from "react-router-dom";
import { ArrowRight, Box, Tag } from "lucide-react";
import { useState } from "react";
import privateApi from "../../api/privateApi";
export default function OrderItemCard({ item, onStatusUpdate }) {
  const [loading, setLoading] = useState(false);

  const imageUrl = item.image
    ? `http://127.0.0.1:8000${item.image}`
    : "/no-image.png";

  const handleReturnRequest = async () => {
  try {
    setLoading(true);
    await privateApi.patch(`orders/my-orders/item/${item.id}/return/`);
    alert("Return request submitted!");
    onStatusUpdate && onStatusUpdate();
  } catch (err) {
    console.error(err);
    alert("Failed to submit return request");
  } finally {
    setLoading(false);
  }
};

const handleMarkReceived = async () => {
  try {
    setLoading(true);
    await privateApi.patch(`orders/my-orders/item/${item.id}/received/`);
    alert("Item marked as received!");
    onStatusUpdate && onStatusUpdate();
  } catch (err) {
    console.error(err);
    alert("Failed to mark item as received");
  } finally {
    setLoading(false);
  }
};


  // Determine which button to show
  const showReturnButton = item.status === "DELIVERED";
  const showReceivedButton = item.status === "DELIVERED";

  return (
    <div className="group bg-white border border-gray-100 hover:border-black transition-all duration-500 rounded-[2rem] p-5 md:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
      
      {/* PRODUCT IMAGE */}
      <div className="relative w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
        />
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex-1 w-full space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="font-black text-xl uppercase tracking-tighter leading-none mb-2 group-hover:text-emerald-600 transition-colors">
              {item.name}
            </h2>
            <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span className="flex items-center gap-1">
                <Tag size={12} /> {item.category || "General"}
              </span>
              <span className="flex items-center gap-1">
                <Box size={12} /> SKU: {item.sku || "N/A"}
              </span>
            </div>
          </div>
          
          {/* STATUS */}
          <div className="hidden sm:block">
            <StatusBadge status={item.status} />
          </div>
        </div>

        {/* PRICE DETAILS */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50 group-hover:border-gray-100 transition-colors">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Unit Price</p>
            <p className="font-bold text-sm">₹{item.price}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Quantity</p>
            <p className="font-bold text-sm">x{item.quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
            <p className="font-black text-base tracking-tighter text-black">₹{item.total}</p>
          </div>
        </div>

        {/* FOOTER: MOBILE STATUS + LINK + ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-2">
          <div className="sm:hidden">
            <StatusBadge status={item.status} />
          </div>

          <div className="flex gap-2">
            {showReturnButton && (
              <button
                onClick={handleReturnRequest}
                disabled={loading}
                className="text-[10px] font-black uppercase tracking-[0.3em] bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                {loading ? "Processing..." : "Request Return"}
              </button>
            )}
            {showReceivedButton && (
              <button
                onClick={handleMarkReceived}
                disabled={loading}
                className="text-[10px] font-black uppercase tracking-[0.3em] bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600"
              >
                {loading ? "Processing..." : "Mark Received"}
              </button>
            )}
          </div>

          {item.product_exists ? (
            <Link
              to={`/product/${item.slug}`}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:text-emerald-500 transition-colors"
            >
              View Product <ArrowRight size={14} />
            </Link>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 italic">
              Archived / Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
