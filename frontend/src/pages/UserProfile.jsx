import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import privateApi from "../api/privateApi";
import { toast } from "react-toastify";
import { User, Mail, Settings, Package, Heart, Store, LogOut } from "lucide-react";

export default function UserProfile() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const location = useLocation();

  const loadProfile = async () => {
    try {
      const res = await privateApi.get("users/profile/user/");
      setForm({
        full_name: res.data.user.full_name,
        email: res.data.user.email,
      });
      setLoading(false);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await privateApi.put("users/profile/user/", form);
      toast.success("Profile updated elegantly ✅");
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  // Define navigation links matching your AppRoutes
  const navLinks = [
    { name: "Account Details", path: "/profile", icon: <Settings size={18} /> },
    { name: "My Orders", path: "/my-orders", icon: <Package size={18} /> },
    { name: "Wishlist", path: "/wishlist", icon: <Heart size={18} /> },
    { name: "Followed Stores", path: "/following-stores", icon: <Store size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Personalizing your experience</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT SIDEBAR - User Menu */}
          <aside className="lg:w-1/4 space-y-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-black border border-gray-100 shadow-sm">
                <User size={30} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-medium text-lg leading-tight">{form.full_name || "Guest"}</h2>
                <p className="text-xs text-gray-400 font-medium">Elite Member</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-medium transition-all ${
                      isActive 
                      ? "bg-black text-white shadow-xl shadow-black/10" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    {item.icon} {item.name}
                  </Link>
                );
              })}
              <button className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-4 w-full text-left">
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </aside>

          {/* RIGHT SIDE - Profile Form */}
          <main className="flex-1">
            <header className="mb-10">
              <h1 className="text-3xl font-medium tracking-tight text-black mb-2">Account Details</h1>
              <p className="text-sm text-gray-500">Update your personal information and contact details.</p>
            </header>

            <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 focus:border-black rounded-2xl pl-12 pr-6 py-4 text-sm transition-all outline-none"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 focus:border-black rounded-2xl pl-12 pr-6 py-4 text-sm transition-all outline-none"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full md:w-auto bg-black text-white px-12 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-80 active:scale-95 transition-all shadow-xl shadow-black/5 disabled:bg-gray-300"
                  >
                    {saving ? "Saving Changes..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Insight */}
            <div className="mt-8 px-8 py-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-4">
              <Settings className="text-blue-500 mt-1" size={18} />
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>Privacy Note:</strong> Your account security is paramount. To change your password or security settings, please visit our <span className="underline cursor-pointer">Security Center</span>.
              </p>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}