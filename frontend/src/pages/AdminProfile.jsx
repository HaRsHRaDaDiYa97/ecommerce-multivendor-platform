import { useEffect, useState } from "react";
import privateApi from "../api/privateApi";
import { toast } from "react-toastify";
import { User, Mail, ShieldCheck, Save, Loader2 } from "lucide-react";

export default function AdminProfile() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await privateApi.get("users/profile/admin/");
      setForm({
        full_name: res.data.user.full_name,
        email: res.data.user.email,
      });
      setLoading(false);
    } catch {
      toast.error("Failed to load admin profile");
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
      await privateApi.put("users/profile/admin/", form);
      toast.success("Admin profile updated successfully ✅");
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-4">
        <Loader2 className="animate-spin text-gray-300" size={32} />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Loading Credentials</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-6 md:pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-black">Profile Settings</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> Administrative Access
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Profile Banner Decor */}
        <div className="h-24 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-50"></div>

        <div className="px-6 md:px-12 pb-12">
          {/* Avatar Placeholder */}
          <div className="relative -mt-10 mb-10">
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white">
              {form.full_name?.charAt(0) || "A"}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                  <User size={12} /> Full Name
                </label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-5 py-4 text-sm transition-all outline-none font-medium"
                  placeholder="E.g. Alexander Pierce"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                  <Mail size={12} /> Email Address
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl px-5 py-4 text-sm transition-all outline-none font-medium"
                  placeholder="admin@elitehub.com"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 active:scale-95 disabled:bg-gray-400"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-gray-400 font-medium">
                Changes will take effect across the master control system immediately.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}