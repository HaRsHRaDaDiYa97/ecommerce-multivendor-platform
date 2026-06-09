import { CheckCircle2, Clock, MapPin, ChevronRight } from "lucide-react";
export default function OrderTimeline({ tracking }) {
  if (!tracking?.length) return (
    <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm">
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Clock className="text-gray-300" size={20} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
        Waiting for logistics update...
      </p>
    </div>
  );

  // Last item is active
  const activeIndex = tracking.length - 1;

  return (
    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-12 border-b border-gray-50 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              Live Tracking
            </h2>
          </div>
          <p className="text-2xl font-black uppercase tracking-tighter text-black">Shipment Log</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-2xl">
          <MapPin size={20} className="text-black" />
        </div>
      </div>

      <div className="relative space-y-0">
        {tracking.map((step, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div key={step.id} className="group flex gap-6 relative pb-10 last:pb-0">

              {/* Connector Line */}
              {idx !== tracking.length - 1 && (
                <div className="absolute left-[11px] top-8 w-[2px] h-full bg-gray-50 group-hover:bg-gray-100 transition-colors" />
              )}

              {/* Node */}
              <div className="relative">
                {isActive ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center relative z-10 shadow-lg">
                    <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center relative z-10 group-hover:border-gray-300 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-gray-400 transition-colors" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 transition-all duration-500 ${isActive ? 'translate-x-0' : 'opacity-60 group-hover:opacity-100'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className={`text-sm font-black uppercase tracking-widest ${isActive ? 'text-black' : 'text-gray-500'}`}>
                    {step.status.replaceAll("_", " ")}
                  </h4>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 leading-relaxed font-medium mb-2 max-w-sm">
                  {step.message}
                </p>

                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    {new Date(step.timestamp).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short',
                      year: 'numeric' 
                    })}
                  </p>
                  {isActive && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded">Active</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Carrier</p>
            <p className="text-[10px] font-black uppercase text-black">EH-Express Logistics</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all">
          Support Center <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
