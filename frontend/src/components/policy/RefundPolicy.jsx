import React from "react";
import { RefreshCcw, CheckCircle, AlertCircle } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3 sticky top-32">
            <div className="p-10 bg-emerald-50 rounded-[3rem] text-emerald-900">
              <RefreshCcw size={32} className="mb-6 opacity-50" />
              <h1 className="text-3xl font-medium tracking-tighter mb-4">Refund Policy</h1>
              <p className="text-sm leading-relaxed opacity-80">We offer a 14-day window for returns on all premium items.</p>
            </div>
          </div>

          <div className="md:w-2/3 space-y-16">
            <section className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">The Process</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Initiate Request", desc: "Visit your account portal and select the items you wish to return." },
                  { step: "02", title: "Complimentary Pickup", desc: "We arrange a secure pickup from your address within 48 hours." },
                  { step: "03", title: "Inspection", desc: "Our quality team verifies the item remains in original condition with tags." },
                  { step: "04", title: "Instant Credit", desc: "Funds are released back to your original payment method immediately." }
                ].map((item) => (
                  <div key={item.step} className="flex gap-6 group">
                    <span className="text-2xl font-serif italic text-gray-200 group-hover:text-black transition-colors">{item.step}</span>
                    <div>
                      <h4 className="font-semibold text-black mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-8 bg-gray-50 rounded-3xl flex gap-4 border border-gray-100">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <p className="text-[11px] text-gray-500 leading-relaxed uppercase tracking-widest font-bold">
                Items must be unworn, unwashed, and in original packaging with all security tags intact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}