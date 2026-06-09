import React from "react";
import { ArrowRight, Shield, Globe, Zap, Plus, Award, Target, Eye, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUsPage() {
  const features = [
    { 
      icon: <Shield size={22} />, 
      title: "Elite Security", 
      desc: "Military-grade encryption for every transaction.",
      image: "https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?auto=format&fit=crop&q=80" 
    },
    { 
      icon: <Globe size={22} />, 
      title: "Global Vision", 
      desc: "Curating trends from London to Tokyo.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80"
    },
    { 
      icon: <Zap size={22} />, 
      title: "Rapid Logic", 
      desc: "Orders reach you in record-breaking time.",
      image: "https://images.unsplash.com/photo-1534452286302-2f5631f795c9?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-black selection:text-white font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center pt-20 px-6">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 z-10">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <span className="w-8 h-[1px] bg-black"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">Since 2026</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[11rem] font-black tracking-tighter leading-[0.85] text-black uppercase mb-8">
              Pure <br />
              <span className="text-gray-200 hover:text-black transition-colors duration-700 cursor-default">Standard.</span>
            </h1>
            <p className="max-w-xl text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
              EliteHub is an architectural approach to retail. We curate 
              <span className="text-black font-semibold italic"> essential aesthetics </span> 
              for the modern minimalist.
            </p>
          </div>
          
          {/* Subtle Side Label */}
          <div className="hidden lg:block lg:col-span-4 rotate-90 origin-right text-right">
            <p className="text-[10px] font-black uppercase tracking-[1em] text-gray-100 whitespace-nowrap">
              Curating the Future of Commerce
            </p>
          </div>
        </div>
      </section>

      {/* --- PHILOSOPHY: OVERLAPPING LAYOUT --- */}
      <section className="py-24 px-6 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                alt="Minimal"
              />
            </div>
            {/* Background floating card */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-black rounded-[2rem] -z-0 hidden md:block" />
          </div>

          <div className="order-1 lg:order-2 space-y-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">
                The <br /> Foundation.
              </h2>
              <p className="text-gray-500 max-w-md text-lg">
                We believe that quality is a form of respect. Respect for your time, your space, and your taste.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { n: "01", t: "Sovereign Quality", b: "We don't stock brands; we stock benchmarks." },
                { n: "02", t: "Radical Value", b: "Luxury should be accessible, not exclusive." },
                { n: "03", t: "Global Ethics", b: "Transparency from factory to your front door." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 border-b border-gray-200 pb-6 group cursor-default">
                  <span className="text-sm font-black text-gray-300 group-hover:text-black transition-colors">{item.n}</span>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1">{item.t}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{item.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID: REFINED --- */}
      <section className="bg-black py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              Why <br /> EliteHub?
            </h2>
            <div className="text-right">
              <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-2">Systems Enabled</p>
              <div className="h-[2px] w-24 bg-white ml-auto"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="group relative h-[450px] overflow-hidden rounded-[2.5rem] p-10 flex flex-col justify-between">
                <div className="absolute inset-0 bg-gray-900">
                  <img 
                    src={f.image} 
                    className="w-full h-full object-cover opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000" 
                    alt={f.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
                    {f.icon}
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tighter mb-2 group-hover:translate-x-2 transition-transform duration-500">{f.title}</h3>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-widest leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF / STATS --- */}
      <section className="py-24 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Products", val: "500+" },
            { label: "Countries", val: "12" },
            { label: "Reviews", val: "10k" },
            { label: "Uptime", val: "99.9%" }
          ].map((s, i) => (
            <div key={i}>
              <p className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-2">{s.val}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-black rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          {/* Decorative spinning plus */}
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Plus size={100} className="text-white animate-spin-slow" />
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-12 relative z-10 leading-[0.9]">
            Join the <br /> Collective.
          </h2>
          
          <Link 
            to="/products" 
            className="group relative inline-flex items-center gap-4 bg-white text-black px-10 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] hover:pr-14 transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10">Enter Store</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* --- MINI FOOTER --- */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">© 2026 EliteHub Systems Inc.</p>
          <div className="flex gap-8 text-black">
             <Instagram size={18} className="hover:opacity-50 cursor-pointer" />
             <Twitter size={18} className="hover:opacity-50 cursor-pointer" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic font-serif">Aesthetics. Utility. Quality.</p>
        </div>
      </footer>

    </div>
  );
}