import React, { useEffect, useState } from "react";
import api from "../api";
import { toast, Toaster } from "react-hot-toast";
import { Store, Mail, Search, ShieldCheck, ShieldAlert, UserCheck, UserMinus } from "lucide-react";

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSellers = async () => {
    try {
      const res = await api.get("/users/admin/sellers/");
      setSellers(res.data);
    } catch (error) {
      console.error("Failed to load sellers", error);
      toast.error("Error fetching seller data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const toggleSellerStatus = async (id, isActive) => {
    const action = isActive ? "disable" : "enable";
    if (!window.confirm(`Are you sure you want to ${action} this seller?`)) return;

    try {
      await api.post(`/users/admin/sellers/${action}/${id}/`);
      toast.success(`Seller ${isActive ? "disabled" : "enabled"} successfully`);
      fetchSellers();
    } catch (error) {
      toast.error(`Failed to ${action} seller`);
    }
  };

  const filteredSellers = sellers.filter(s => 
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-2">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-medium text-black tracking-tight uppercase">Seller Management</h1>
          <p className="text-sm text-gray-400 mt-1 font-normal">
            Monitor and control merchant access to the platform.
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search shops or names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#fcfcfc] border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfcfc] border-b border-gray-100">
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]">Store Details</th>
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]">Contact</th>
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]">Status</th>
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em] text-right">Access Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}><td colSpan="4" className="px-8 py-6"><div className="h-10 bg-gray-50 animate-pulse rounded-lg w-full"></div></td></tr>
              ))
            ) : (
              filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50/80 transition-all duration-200 group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-medium transition-transform group-hover:scale-105">
                        <Store size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-[15px]">{seller.shop_name || "Personal Seller"}</div>
                        <div className="text-[12px] text-gray-400 font-normal">{seller.full_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-[13px] text-gray-500 font-normal">
                      <Mail size={14} className="text-gray-300" />
                      {seller.email}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {seller.is_active ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <ShieldCheck size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-red-50 text-red-500 border border-red-100">
                        <ShieldAlert size={12} /> Restricted
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    {seller.is_active ? (
                      <button
                        onClick={() => toggleSellerStatus(seller.id, true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-500 hover:text-white hover:bg-red-600 border border-red-100 hover:border-red-600 rounded-lg transition-all active:scale-95"
                      >
                        <UserMinus size={14} />
                        DISABLE
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleSellerStatus(seller.id, false)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-emerald-600 hover:text-white hover:bg-emerald-600 border border-emerald-100 hover:border-emerald-600 rounded-lg transition-all active:scale-95"
                      >
                        <UserCheck size={14} />
                        ENABLE
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && filteredSellers.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-sm text-gray-400 font-normal italic">No sellers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}