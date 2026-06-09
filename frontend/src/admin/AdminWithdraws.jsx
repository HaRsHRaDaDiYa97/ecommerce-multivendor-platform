import { useEffect, useState } from "react";
import {
  getAdminWithdrawRequests,
  approveAdminWithdraw,
  rejectAdminWithdraw,
} from "../api/sellerApi.js";
import { Wallet, Clock, CheckCircle2, XCircle, User, Mail, Calendar, StickyNote } from "lucide-react";

export default function AdminWithdraws() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState({});

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getAdminWithdrawRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching withdraw requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveAdminWithdraw(id, { admin_note: notes[id] || "" });
      fetchRequests();
    } catch (error) {
      console.error("Approve error", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAdminWithdraw(id, { admin_note: notes[id] || "" });
      fetchRequests();
    } catch (error) {
      console.error("Reject error", error);
    }
  };

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto p-10 pt-24 space-y-6 animate-pulse">
      <div className="h-12 bg-gray-100 w-64 rounded-2xl mb-8"></div>
      {[1, 2, 3].map(i => <div key={i} className="h-44 bg-gray-50 rounded-[2.5rem]"></div>)}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 px-4 md:px-10 pt-8">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-[2px] w-8 bg-indigo-600"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Treasury</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-slate-900 leading-none">
              Withdraw <span className="text-slate-300 italic">Queue</span>
            </h1>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Wallet size={18} />
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pending Review</p>
                <p className="text-sm font-black text-slate-900 leading-none">{requests.filter(r => r.status === 'pending').length} Requests</p>
             </div>
          </div>
        </div>

        {/* --- LIST --- */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-[3rem] py-32 text-center border border-dashed border-slate-200">
            <CheckCircle2 className="mx-auto mb-4 text-emerald-500 opacity-20" size={64} />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">The queue is currently empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((r) => (
              <div
                key={r.id}
                className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 transition-all duration-500 hover:shadow-2xl hover:border-indigo-200 relative"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  
                  {/* Seller Info */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/10">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{r.seller}</h3>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail size={12} />
                          <span className="text-xs font-bold truncate max-w-[150px]">{r.seller_email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      r.status === "approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                      r.status === "rejected" ? "bg-red-50 text-red-600 border border-red-100" : 
                      "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                       {r.status === 'pending' && <Clock size={12} />}
                       {r.status === 'approved' && <CheckCircle2 size={12} />}
                       {r.status === 'rejected' && <XCircle size={12} />}
                       {r.status}
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="lg:col-span-4 lg:border-x lg:border-slate-50 lg:px-10 space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Requested Amount</p>
                      <p className="text-4xl font-black tracking-tighter text-slate-900">₹{r.amount}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={12} />
                          <p className="text-[10px] font-bold uppercase tracking-tight">Requested: {new Date(r.requested_at).toLocaleDateString()}</p>
                       </div>
                       {r.processed_at && (
                          <div className="flex items-center gap-2 text-indigo-400">
                             <CheckCircle2 size={12} />
                             <p className="text-[10px] font-bold uppercase tracking-tight">Processed: {new Date(r.processed_at).toLocaleDateString()}</p>
                          </div>
                       )}
                    </div>
                  </div>

                  {/* Actions & Notes */}
                  <div className="lg:col-span-4 space-y-4">
                    {r.status === "pending" ? (
                      <div className="space-y-4">
                        <div className="relative group/note">
                           <StickyNote size={14} className="absolute left-4 top-4 text-slate-300 group-focus-within/note:text-indigo-500 transition-colors" />
                           <input
                             type="text"
                             placeholder="Internal admin note..."
                             value={notes[r.id] || ""}
                             onChange={(e) => handleNoteChange(r.id, e.target.value)}
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                           />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReject(r.id)}
                            className="flex-1 border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="flex-[1.5] bg-slate-900 text-white hover:bg-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                          >
                            <CheckCircle2 size={16} /> Approve
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <StickyNote size={10} /> Admin Memo
                        </p>
                        <p className="text-xs font-bold italic text-slate-600 leading-relaxed">
                          {r.admin_note || "No notes recorded for this transaction."}
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}