import React, { useEffect, useState } from 'react';
import { LayoutDashboard, TrendingUp, Package, Star, Clock } from 'lucide-react';
import { getSellerDashboardStats } from '../api/sellerApi';

export default function SellerDashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getSellerDashboardStats();
        setData(res);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-bold">
        Loading Dashboard...
      </div>
    );
  }

  // ✅ Dynamic stats (NO DESIGN CHANGE)
  const stats = [
    {
      label: 'Total Sales',
      value: `₹${data?.total_sales || 0}`,
      icon: <TrendingUp size={20} />,
      borderColor: 'group-hover:border-emerald-500'
    },
    {
      label: 'Pending Orders',
      value: data?.pending_orders || 0,
      icon: <Clock size={20} />,
      borderColor: 'group-hover:border-orange-500'
    },
    {
      label: 'Active Products',
      value: data?.active_products || 0,
      icon: <Package size={20} />,
      borderColor: 'group-hover:border-blue-500'
    },
    {
      label: 'Store Rating',
      value: `${data?.average_rating || 0}/5`,
      icon: <Star size={20} />,
      colorClass: 'text-purple-500',
      borderColor: 'group-hover:border-purple-500'
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* --- DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-12 bg-black"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
                System Overview
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-black">
              Seller <br />
              <span className="text-gray-300 italic">Terminal</span>
            </h1>
          </div>

          <div className="hidden lg:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-right text-gray-400 mb-2">
              System Health
            </p>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`group bg-white p-8 rounded-[2.5rem] border border-gray-100 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 ${stat.borderColor}`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl bg-gray-50 transition-colors duration-500 group-hover:bg-black group-hover:text-white ${stat.colorClass || 'text-black'}`}>
                  {stat.icon}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 transition-colors group-hover:text-gray-500">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black tracking-tighter text-black uppercase leading-none">
                  {stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* --- QUICK ACTIONS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
                Store Performance
              </h2>
              <p className="text-gray-400 text-sm font-medium mb-8 max-w-md">
                Your store's rating has increased by <span className="text-emerald-500">0.2%</span> this week.
                Keep fulfilling orders on time to maintain your Elite status.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-black text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                  View Analytics
                </button>
                <button className="bg-gray-100 text-black px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                  Download Report
                </button>
              </div>
            </div>

            {/* Decorative Element */}
            <LayoutDashboard className="absolute -bottom-10 -right-10 text-gray-50 w-64 h-64 -rotate-12" />
          </div>

          <div className="bg-emerald-500 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-lg shadow-emerald-500/20">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">
                Pro Tip
              </h3>
              <p className="text-emerald-100 text-sm font-bold tracking-tight">
                Items with high-quality white background images sell 40% faster on the Elite platform.
              </p>
            </div>
            <div className="pt-8">
              <div className="h-[2px] w-full bg-white/20 mb-4"></div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                Elite Hub Seller Success Program
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}