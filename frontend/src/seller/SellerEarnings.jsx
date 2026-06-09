import { useEffect, useState } from "react";
import { getSellerEarnings, createWithdrawRequest } from "../api/sellerApi";
import { Wallet, ArrowUpRight, TrendingUp, Clock, Info, AlertCircle, CheckCircle2, History, ArrowDown, StickyNote } from "lucide-react";

export default function SellerEarnings() {
  const [earnings, setEarnings] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const data = await getSellerEarnings();
      setEarnings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) > parseFloat(earnings.available_balance)) {
      setMessage("Invalid amount");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const res = await createWithdrawRequest(amount);
      setMessage(res.message);
      setAmount("");
      fetchEarnings();
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!earnings) return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 pt-24 animate-pulse">
      <div className="h-12 bg-gray-100 w-64 rounded-2xl mb-12"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-44 bg-gray-50 rounded-[2.5rem]"></div>)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 px-4 md:px-10 ">
      <div className="max-w-6xl mx-auto">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-[2px] w-8 bg-black"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Financials</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-black leading-none">
              Earnings <span className="text-gray-300 italic">Report</span>
            </h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 flex items-center gap-2 self-start md:self-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Balance Access</span>
          </div>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
            <TrendingUp className="absolute -right-4 -top-4 text-gray-50 w-24 h-24 rotate-12" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lifetime Revenue</p>
            <h2 className="text-4xl font-black tracking-tighter text-black">
              ₹{(earnings.pending_balance + earnings.available_balance + earnings.withdrawn_balance).toFixed(2)}
            </h2>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm group">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Escrow</p>
              <Clock size={14} className="text-orange-400" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-black">
              ₹{earnings.pending_balance.toFixed(2)}
            </h2>
            <div className="mt-3 flex items-center gap-1.5 text-orange-500">
              <Info size={10} />
              <p className="text-[9px] font-bold uppercase tracking-tight leading-none">Cleared 7 days post-delivery</p>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-8 rounded-[2.5rem] shadow-xl relative group">
            <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest">Ready</div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available to Withdraw</p>
            <h2 className="text-4xl font-black tracking-tighter text-black">
              ₹{earnings.available_balance.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* --- WITHDRAW SECTION --- */}
        <div className="bg-black text-white p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-black/20 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white">Withdraw Funds</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">
                  Transfer your available balance to your bank account. Settlements are typically processed within 24-48 business hours.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-start gap-4">
                <AlertCircle className="text-emerald-500 shrink-0 mt-1" size={18} />
                <div>
                  <span className="text-white font-black uppercase text-[10px] tracking-widest block mb-1">Settlement Policy</span>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    To maintain platform security, funds are held for 7 days post-delivery to ensure customer satisfaction before release.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-lg">₹</div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 px-12 py-6 rounded-[2rem] text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white/15 transition-all placeholder:text-gray-600"
                />
              </div>

              <button
                onClick={handleWithdraw}
                disabled={loading || !amount || parseFloat(amount) > parseFloat(earnings.available_balance)}
                className="w-full bg-emerald-500 disabled:bg-white/10 disabled:text-gray-500 text-black px-8 py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/10"
              >
                {loading ? <span className="animate-pulse">Processing...</span> : <>Request Transfer <ArrowUpRight size={18} /></>}
              </button>

              {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  message.toLowerCase().includes('error') || message.toLowerCase().includes('invalid') || message.toLowerCase().includes('wrong')
                  ? 'bg-red-500/20 text-red-200 border border-red-500/30' 
                  : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                }`}>
                   {message.toLowerCase().includes('error') ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>}
                   <p className="text-[10px] font-black uppercase tracking-widest">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- WITHDRAW HISTORY --- */}
        <div className="mt-16 space-y-8">
          <div className="flex items-center gap-4">
            <div className="bg-black p-3 text-white rounded-2xl shadow-xl">
               <History size={20} />
            </div>
            <div>
               <h2 className="text-2xl font-black tracking-tight uppercase leading-none">History</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Transaction Log</p>
            </div>
          </div>

          {earnings.withdraw_requests.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-12 text-center border-dashed">
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No payout records found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {earnings.withdraw_requests.map((w) => (
                <div key={w.id} className="bg-white border border-gray-100 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-black transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      w.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                      w.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <p className="text-xl font-black tracking-tighter">₹{w.amount.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={10} className="text-gray-400" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                          {new Date(w.requested_at).toLocaleDateString()} at {new Date(w.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      w.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                      w.status === 'rejected' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                    }`}>
                      {w.status}
                    </span>
                    {w.admin_note && (
                      <p className="text-[10px] font-bold text-gray-500 italic flex items-center gap-1.5">
                        <StickyNote size={10} /> {w.admin_note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}