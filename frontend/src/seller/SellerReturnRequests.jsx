import { useEffect, useState } from "react";
import { getReturnRequests, handleReturnRequest } from "../api/sellerApi";
import { RotateCcw, User, Tag, Check, X, AlertCircle } from "lucide-react";

export default function SellerReturnRequests() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const data = await getReturnRequests();
      setReturns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (itemId, action) => {
    try {
      await handleReturnRequest(itemId, action);
      fetchReturns(); 
    } catch (err) {
      console.error(err);
      alert("Failed to process return request");
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-4 animate-pulse pt-10">
      <div className="h-10 bg-gray-100 w-48 rounded-lg mb-8"></div>
      {[1, 2].map(n => <div key={n} className="h-40 bg-gray-50 rounded-[2rem]"></div>)}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[2px] w-8 bg-black"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Management</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            Return <span className="text-gray-300 italic">Requests</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm self-start md:self-auto">
          <AlertCircle size={14} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            Pending Action: {returns.length}
          </span>
        </div>
      </div>

      {/* Requests List */}
      {returns.length === 0 ? (
        <div className="text-center py-24 bg-white border border-gray-100 rounded-[3rem] shadow-sm">
          <RotateCcw className="mx-auto mb-4 text-gray-100" size={60} />
          <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px] font-black">No active return requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {returns.map((item) => (
            <div 
              key={item.item_id} 
              className="group bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-8 transition-all duration-300 hover:border-black shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                
                {/* Product & Customer Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                      <Tag size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Product Subject</p>
                      <h3 className="text-lg font-black uppercase tracking-tight text-black line-clamp-1">{item.product}</h3>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 pl-16">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-300" />
                      <span className="text-xs font-bold text-gray-500">{item.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount:</span>
                      <span className="text-sm font-black tracking-tighter text-black">₹{item.price}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Friendly Action Buttons */}
                <div className="flex items-center gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                  <button
                    onClick={() => handleAction(item.item_id, "reject")}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <X size={16} /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(item.item_id, "approve")}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-black/5"
                  >
                    <Check size={16} /> Approve
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}