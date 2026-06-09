import { useState, useEffect } from "react";
import { MapPin, User, Phone, Home, Briefcase, Globe, X } from "lucide-react";

export default function AddressForm({ onSave, editingAddress, onCancel }) {
  const emptyForm = {
    label: "",
    address_type: "HOME",
    full_name: "",
    phone: "",
    address_line: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    is_default: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (editingAddress) setFormData(editingAddress);
  }, [editingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData(emptyForm);
  };

  // Helper for consistent input styling
  const inputClasses = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder:text-gray-300";

  return (
    <form onSubmit={submitHandler} className="mt-6 bg-white p-2 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* HEADER & CLOSE */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
          <MapPin size={16} /> 
          {editingAddress ? "Modify Address" : "New Shipping Destination"}
        </h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-black transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* ADDRESS TYPE SELECTOR (Replaces Select Dropdown) */}
        <div className="col-span-2 flex gap-3 mb-2">
          {["HOME", "OFFICE", "OTHER"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, address_type: type })}
              className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                formData.address_type === type 
                ? "border-black bg-black text-white shadow-lg" 
                : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
              }`}
            >
              {type === "HOME" && <Home size={14} />}
              {type === "OFFICE" && <Briefcase size={14} />}
              {type === "OTHER" && <Globe size={14} />}
              {type}
            </button>
          ))}
        </div>

        {/* LABEL */}
        <div className="col-span-2 md:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Address Label (e.g. My Villa)</label>
          <input 
            placeholder="Label" 
            className={inputClasses}
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required 
          />
        </div>

        {/* FULL NAME */}
        <div className="col-span-2 md:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Recipient Name</label>
          <div className="relative">
             <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
             <input 
                placeholder="Full Name" 
                className={`${inputClasses} pl-11`}
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required 
              />
          </div>
        </div>

        {/* PHONE */}
        <div className="col-span-2 md:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Contact Number</label>
          <div className="relative">
             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
             <input 
                placeholder="Phone" 
                className={`${inputClasses} pl-11`}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required 
              />
          </div>
        </div>

        {/* PINCODE */}
        <div className="col-span-2 md:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Pincode</label>
          <input 
            placeholder="Pincode" 
            className={inputClasses}
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            required 
          />
        </div>

        {/* ADDRESS LINE */}
        <div className="col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Street Address</label>
          <input 
            placeholder="House No, Street Name, Area..." 
            className={inputClasses}
            value={formData.address_line}
            onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
            required 
          />
        </div>

        {/* LANDMARK */}
        <div className="col-span-2 md:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Landmark (Optional)</label>
          <input 
            placeholder="e.g. Near Grand Mall" 
            className={inputClasses}
            value={formData.landmark}
            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} 
          />
        </div>

        {/* CITY */}
        <div className="col-span-2 md:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">City</label>
          <input 
            placeholder="City" 
            className={inputClasses}
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required 
          />
        </div>

        {/* STATE */}
        <div className="col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1 mb-2 block">State</label>
          <input 
            placeholder="State" 
            className={inputClasses}
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required 
          />
        </div>

        {/* ACTIONS */}
        <div className="col-span-2 flex gap-4 pt-4">
          <button className="flex-1 bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/10">
            {editingAddress ? "Update Destination" : "Securely Save Address"}
          </button>
          
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-8 py-4 rounded-2xl border border-gray-100 font-bold uppercase tracking-[0.2em] text-[11px] text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
          >
            Discard
          </button>
        </div>
      </div>
    </form>
  );
}