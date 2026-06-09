import { Edit3, Trash2, MapPin, CheckCircle2, Home, Briefcase, Globe } from "lucide-react";

export default function AddressList({
  addresses,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) {
  
  // Helper to get the icon based on address type
  const getAddressIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "HOME": return <Home size={16} />;
      case "OFFICE": return <Briefcase size={16} />;
      default: return <Globe size={16} />;
    }
  };

  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {addresses?.map((addr) => {
        const isSelected = selected?.id === addr.id;
        
        return (
          <div
            key={addr.id}
            className={`group relative flex flex-col justify-between p-5 rounded-[1.5rem] border-2 transition-all duration-300 ${
              isSelected 
              ? "border-black bg-white shadow-xl shadow-black/5 ring-1 ring-black" 
              : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md"
            }`}
          >
            {/* SELECTION OVERLAY (Clickable area) */}
            <div 
              onClick={() => onSelect(addr)} 
              className="cursor-pointer flex-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}>
                  {getAddressIcon(addr.address_type)}
                </div>
                {isSelected && (
                  <CheckCircle2 size={20} className="text-black fill-white" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm tracking-tight text-gray-900 truncate">
                    {addr.label}
                  </h4>
                  {addr.is_default && (
                    <span className="text-[8px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                
                <p className="text-sm font-medium text-gray-700">{addr.full_name}</p>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {addr.address_line}
                </p>
                <p className="text-xs text-gray-500">
                  {addr.city}, {addr.state} — {addr.pincode}
                </p>
                
                <div className="flex items-center gap-1.5 pt-2 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                  <MapPin size={12} />
                  {addr.phone}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mt-6 pt-4 border-t border-gray-50">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(addr); }} 
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                <Edit3 size={12} />
                Edit
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(addr.id); }} 
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}