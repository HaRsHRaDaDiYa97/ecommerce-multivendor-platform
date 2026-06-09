import React from 'react';
import { TrendingUp, Users, Activity, AlertTriangle, ArrowUpRight, Globe } from 'lucide-react';

export default function AdminDashboard() {
  const globalStats = [
    { title: "Total Revenue", value: "$124,500", detail: "+14% vs last month", icon: <TrendingUp size={20} />, trend: "up" },
    { title: "Active Sellers", value: "154", detail: "8 pending approval", icon: <Users size={20} />, trend: "neutral" },
    { title: "Daily Visitors", value: "12,402", detail: "Real-time tracking", icon: <Activity size={20} />, trend: "up" },
    { title: "Reported Items", value: "3", detail: "Requires attention", icon: <AlertTriangle size={20} />, trend: "down" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- ADMIN HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe size={14} className="text-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Master Control</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase text-slate-900 leading-none">
              Platform <span className="text-slate-300 italic">Overview</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">System Status</p>
              <p className="text-xs font-bold text-emerald-500 uppercase">All Nodes Healthy</p>
            </div>
            <div className="h-12 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
            <button className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-black/5">
              Generate System Report
            </button>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {globalStats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border border-slate-100 p-7 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                  {stat.icon}
                </div>
                <ArrowUpRight size={18} className="text-slate-200 group-hover:text-indigo-500 transition-colors" />
              </div>
              
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                  {stat.value}
                </h3>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
                    stat.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {stat.detail}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- ANALYTICS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Global Sales Analytics</h3>
              <div className="flex gap-2">
                {['24H', '7D', '1M', '1Y'].map(t => (
                  <button key={t} className="text-[10px] font-black px-3 py-1 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-80 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="flex items-end gap-2 h-20">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="w-3 bg-indigo-100 rounded-t-sm group-hover:bg-indigo-500 transition-all"></div>
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Data Engine Visualizer Placeholder</p>
            </div>
          </div>

          {/* Quick Actions / Alerts */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Admin Notice</h3>
              <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-6">
                There are 8 sellers awaiting documentation verification. Platform policy requires approval within 24 hours.
              </p>
              <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">
                Review Pending Sellers
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6">System Health</h3>
              <div className="space-y-4">
                {['Database', 'API Gateway', 'CDN'].map(service => (
                  <div key={service} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{service}</span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase">Stable</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}