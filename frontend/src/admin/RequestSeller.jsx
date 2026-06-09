import React, { useEffect, useState } from "react";
import api from "../api";
import { toast, Toaster } from "react-hot-toast";
import { Check, X, Mail, Phone, MapPin, Landmark, Store } from "lucide-react";

export default function RequestSeller() {
  const [users, setUsers] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    api
      .get("users/seller/requests/")
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error("Error fetching seller requests:", err);
        toast.error("Failed to load requests");
      });
  }, []);

  const approveSeller = async (userId) => {
    setLoadingAction(userId);
    try {
      await api.post(`users/seller/approve/${userId}/`);
      toast.success("Seller Approved Successfully");
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      toast.error("Approval failed");
    } finally {
      setLoadingAction(null);
    }
  };

  const disapproveSeller = async (userId) => {
    if (!window.confirm("Are you sure you want to decline this request?")) return;
    setLoadingAction(userId);
    try {
      await api.post(`users/seller/disapprove/${userId}/`);
      toast.error("Request Disapproved");
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight uppercase">Seller Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Review and verify applications for new store partners.</p>
        </div>
        <div className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest">
          {users.length} PENDING
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-20 text-center">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="text-gray-300" size={32} />
          </div>
          <p className="text-gray-500 font-medium">No pending seller requests at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {users.map(user => (
            <div key={user.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-50 flex justify-between items-start">
                <div className="flex gap-4 italic font-medium">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-black font-bold text-xl">
                    {user.shop_name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black leading-tight">{user.shop_name}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{user.full_name}</p>
                  </div>
                </div>
              </div>

              {/* Card Body - Business Details */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  <span>{user.phone_number}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 md:col-span-2">
                  <MapPin size={16} className="text-gray-400 shrink-0" />
                  <span className="line-clamp-1">{user.business_address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 md:col-span-2">
                  <Landmark size={16} className="text-gray-400" />
                  <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    TAX ID: {user.tax_id}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-gray-50/50 flex gap-3">
                <button
                  onClick={() => approveSeller(user.id)}
                  disabled={loadingAction === user.id}
                  className="flex-1 bg-black text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:bg-gray-400"
                >
                  <Check size={16} />
                  APPROVE PARTNER
                </button>
                <button
                  onClick={() => disapproveSeller(user.id)}
                  disabled={loadingAction === user.id}
                  className="px-4 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 py-3 rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}