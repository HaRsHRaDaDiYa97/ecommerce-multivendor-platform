import { useEffect, useState } from "react";
import privateApi from "../api/privateApi";
import { toast } from "react-toastify";
import { 
  Store, MapPin, CreditCard, Phone, 
  User, Mail, Briefcase, Loader2, AlertCircle 
} from "lucide-react";

export default function SellerProfile() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    shop_name: "",
    business_address: "",
    tax_id: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await privateApi.get("users/profile/seller/");
      const user = res.data.user;
      const seller = res.data.seller_profile;
      const roleFlag = res.data.is_seller;


      setForm({
        full_name: user.full_name,
        email: user.email,
        shop_name: seller?.shop_name || "",
        business_address: seller?.business_address || "",
        tax_id: seller?.tax_id || "",
        phone_number: seller?.phone_number || "",
      });
      setIsSeller(roleFlag);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load seller profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSeller) {
      toast.warning("You are not a seller yet.");
      return;
    }

    setSaving(true);
    try {
      await privateApi.put("users/profile/seller/", {
        shop_name: form.shop_name,
        business_address: form.business_address,
        tax_id: form.tax_id,
        phone_number: form.phone_number,
      });
      toast.success("Business profile updated ✅");
    } catch (error) {
      console.error(error);
      toast.error("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-gray-400" size={32} />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Loading Business Data</p>
      </div>
    );
  }

  if (!isSeller) {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] border border-gray-100 text-center shadow-sm">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-medium text-black mb-2">Access Restricted</h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          You are not currently registered as a seller. Please submit a seller request to access this portal.
        </p>
        <button className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all">
          Request Seller Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 md:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-medium tracking-tight text-black">Business Profile</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
            <Briefcase size={12} /> Merchant Status: Active
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Account Credentials (Locked) */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-10 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
            <User size={14} /> Personal Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  name="full_name"
                  value={form.full_name}
                  readOnly
                  className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  name="email"
                  value={form.email}
                  readOnly
                  className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>
          <p className="text-[9px] text-gray-400 mt-4 italic">* Account credentials can only be changed via Global Admin support.</p>
        </div>

        {/* Section 2: Shop Details (Editable) */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 md:p-10 shadow-sm space-y-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
            <Store size={14} /> Shop Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Shop Name</label>
              <div className="relative text-black">
                <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  name="shop_name"
                  value={form.shop_name}
                  onChange={handleChange}
                  placeholder="e.g. Elite Artisans"
                  className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Business Address</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-8 -translate-y-1/2 text-gray-300" size={16} />
                <textarea
                  name="business_address"
                  value={form.business_address}
                  onChange={handleChange}
                  placeholder="Enter your full operational address"
                  className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm h-32 focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Tax ID / GST Number</label>
              <div className="relative">
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  name="tax_id"
                  value={form.tax_id}
                  onChange={handleChange}
                  placeholder="e.g. TAX-9944-00"
                  className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-10 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-80 transition-all flex items-center gap-2 shadow-xl shadow-black/10 disabled:bg-gray-400"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : "Update Business Profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}