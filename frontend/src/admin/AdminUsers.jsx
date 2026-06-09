import React, { useEffect, useState } from "react";
import api from "../api";
import { toast, Toaster } from "react-hot-toast";
import { Trash2, User, Mail, Search, Shield } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/admin/users/");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users", error);
      toast.error("Could not fetch user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/admin/users/delete/${id}/`);
      toast.success("User removed");
      fetchUsers();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-2">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-medium text-black tracking-tight">Users</h1>
          <p className="text-sm text-gray-400 mt-1 font-normal">
            Viewing {filteredUsers.length} total registered accounts.
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search by name or email..."
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
            <tr className="bg-white border-b border-gray-100">
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]">Identity</th>
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em] hidden sm:table-cell">Contact Information</th>
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="3" className="px-8 py-4"><div className="h-8 bg-gray-50 animate-pulse rounded-md w-full"></div></td>
                </tr>
              ))
            ) : (
              filteredUsers.map((u) => (
                <tr 
                  key={u.id} 
                  className="hover:bg-gray-50/80 transition-all duration-200 group cursor-default"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar with Medium font and subtle border */}
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium text-sm transition-transform group-hover:scale-105 duration-200">
                        {u.full_name?.charAt(0).toUpperCase() || <User size={14}/>}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-[15px]">{u.full_name || "Anonymous User"}</div>
                        <div className="text-[12px] text-gray-400 font-normal">Serial: #{u.serial || u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2.5 text-sm text-gray-500 font-normal">
                      <Mail size={14} className="text-gray-300" />
                      {u.email}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="inline-flex items-center justify-center p-2.5 text-gray-300 hover:text-black hover:bg-white border border-transparent hover:border-gray-200 rounded-full transition-all active:scale-95"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && filteredUsers.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-sm text-gray-400 font-normal italic">No matching users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}