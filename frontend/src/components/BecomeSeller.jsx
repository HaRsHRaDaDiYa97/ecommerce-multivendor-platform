import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Store, MapPin, CreditCard, Phone, CheckCircle, ArrowRight } from "lucide-react";
import privateApi from "../api/privateApi";

export default function BecomeSeller() {
  const [form, setForm] = useState({
    shop_name: "",
    business_address: "",
    tax_id: "",
    phone_number: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await privateApi.post("users/seller/request/", form);
      toast.success(res.data.message || "Request sent successfully!");
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle className="text-white" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-medium text-black tracking-tight">Application Received</h2>
            <p className="text-gray-500 font-normal leading-relaxed">
              Thank you for applying to be a merchant. Our team will review your 
              business details and get back to you within 2-3 business days.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 text-sm font-medium border-b border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-all"
          >
            Return to Homepage <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-6 bg-[#FAFAFA]">
      <Toaster position="top-right" />
      
      <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="mb-10 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-2xl mb-2">
              <Store className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-medium text-black tracking-tight">Merchant Application</h2>
            <p className="text-gray-400 text-sm font-normal">
              Join our marketplace and start reaching thousands of customers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-gray-400 uppercase tracking-widest ml-1">Official Shop Name</label>
              <div className="relative group">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                <input
                  name="shop_name"
                  value={form.shop_name}
                  onChange={handleChange}
                  placeholder="e.g. Modern Studios"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            {/* Business Address */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-gray-400 uppercase tracking-widest ml-1">Business Address</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                <input
                  name="business_address"
                  value={form.business_address}
                  onChange={handleChange}
                  placeholder="Full physical address"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tax ID */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-widest ml-1">Tax ID / GST</label>
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                  <input
                    name="tax_id"
                    value={form.tax_id}
                    onChange={handleChange}
                    placeholder="ID Number"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-2xl font-medium text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-300 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? "Processing..." : "Submit Application"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 