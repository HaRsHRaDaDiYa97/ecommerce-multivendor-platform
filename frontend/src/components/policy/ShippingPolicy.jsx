import React from "react";
import { Truck, Globe, ShieldCheck, Box } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex p-3 bg-gray-50 rounded-full text-black mb-4">
            <Truck size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-black">Shipping & Delivery</h1>
          <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">EliteHub Logistics Excellence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: <Globe size={20}/>, title: "Worldwide", desc: "Shipping to over 50 countries" },
            { icon: <ShieldCheck size={20}/>, title: "Secure", desc: "Fully insured transit" },
            { icon: <Box size={20}/>, title: "Packaging", desc: "Eco-luxury materials" }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-gray-50 rounded-[2rem] text-center border border-gray-100">
              <div className="flex justify-center mb-4 text-black">{item.icon}</div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <article className="prose prose-gray max-w-none space-y-12 text-gray-600">
          <section>
            <h2 className="text-2xl font-medium text-black mb-4">Processing Times</h2>
            <p>All orders are processed within 24–48 hours. Orders placed on weekends or holidays will be processed the next business day. You will receive a tracking number via email once your order has been dispatched.</p>
          </section>
          <section className="bg-black text-white p-8 md:p-12 rounded-[2.5rem]">
            <h2 className="text-2xl font-medium text-white mb-6">Delivery Estimates</h2>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-white/60 uppercase tracking-widest text-[10px]">Domestic (India)</span>
                <span>3–5 Business Days</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-white/60 uppercase tracking-widest text-[10px]">Express Shipping</span>
                <span>1–2 Business Days</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-white/60 uppercase tracking-widest text-[10px]">International</span>
                <span>7–12 Business Days</span>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}