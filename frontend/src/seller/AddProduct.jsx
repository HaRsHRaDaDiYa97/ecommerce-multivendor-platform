// import React, { useEffect, useState } from "react";
// import api from "../api";
// import { toast, Toaster } from "react-hot-toast";
// import { Package, Tag, DollarSign, Box, Image as ImageIcon, Plus, Info } from "lucide-react";

// export default function AddProduct() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [preview, setPreview] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     sale_price: "",
//     stock: "",
//     sku: "",
//     category: "",
//     length: "",
//     width: "",
//     height: "",
//     weight: "",
//     image: null,
//     images: [],
//   });

//   useEffect(() => {
//     api.get("products/categories/").then(res => setCategories(res.data));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "image") {
//       const file = files[0];
//       setFormData({ ...formData, image: file });
//       setPreview(URL.createObjectURL(file)); // Create local preview URL
//     } else if (name === "images") {
//       setFormData({ ...formData, images: files });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === "images") {
//         Array.from(value).forEach(img => data.append("images", img));
//       } else if (value !== "" && value !== null) {
//         data.append(key, value);
//       }
//     });

//     try {
//       await api.post("products/items/", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Product published successfully");
//       // Reset logic
//       setFormData({
//         name: "", description: "", price: "", sale_price: "",
//         stock: "", sku: "", category: "", length: "",
//         width: "", height: "", weight: "", image: null, images: [],
//       });
//       setPreview(null);
//     } catch (err) {
//       toast.error("Failed to add product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto py-8 px-6">
//       <Toaster position="top-right" />
      
//       <div className="flex items-center justify-between mb-10">
//         <div>
//           <h2 className="text-3xl font-medium text-black tracking-tight">Create Product</h2>
//           <p className="text-sm text-gray-400 mt-1 font-normal">List a new item in your store catalog.</p>
//         </div>
//         <Package className="text-gray-200" size={40} strokeWidth={1} />
//       </div>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* Left Column: Details */}
//         <div className="lg:col-span-2 space-y-8">
          
//           {/* Section 1: General Info */}
//           <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
//             <div className="flex items-center gap-2 mb-6 text-gray-400">
//               <Info size={16} />
//               <span className="text-[11px] font-medium uppercase tracking-[0.2em]">General Information</span>
//             </div>
            
//             <div className="space-y-6">
//               <div>
//                 <label className="text-xs font-medium text-gray-500 mb-2 block">Product Title</label>
//                 <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Minimalist Silk Dress"
//                   className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium text-sm" required />
//               </div>

//               <div>
//                 <label className="text-xs font-medium text-gray-500 mb-2 block">Description</label>
//                 <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Write about the materials, fit, and style..."
//                   className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-normal text-sm resize-none" required />
//               </div>
//             </div>
//           </div>

//           {/* Section 2: Inventory & Logistics */}
//           <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
//             <div className="flex items-center gap-2 mb-6 text-gray-400">
//               <Box size={16} />
//               <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Inventory & Dimensions</span>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               <div>
//                 <label className="text-xs font-medium text-gray-500 mb-2 block">Available Stock</label>
//                 <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="0"
//                   className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm font-medium" required />
//               </div>
//               <div>
//                 <label className="text-xs font-medium text-gray-500 mb-2 block">SKU / Model Number</label>
//                 <input name="sku" value={formData.sku} onChange={handleChange} placeholder="PROD-100"
//                   className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm font-medium" />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {['length', 'width', 'height', 'weight'].map((dim) => (
//                 <div key={dim}>
//                   <label className="text-[10px] font-medium text-gray-400 uppercase mb-2 block">{dim}</label>
//                   <input name={dim} type="number" value={formData[dim]} onChange={handleChange} placeholder="0.0"
//                     className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Column: Sidebar */}
//         <div className="space-y-8">
          
//           {/* Section 3: Media */}
//           <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6 text-gray-400">
//               <ImageIcon size={16} />
//               <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Media</span>
//             </div>
            
//             <div className="space-y-4">
//               <div className="aspect-square w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group">
//                 {preview ? (
//                   <img src={preview} alt="Preview" className="w-full h-full object-cover" />
//                 ) : (
//                   <>
//                     <ImageIcon className="text-gray-200 mb-2" size={32} />
//                     <span className="text-[10px] text-gray-400 font-medium">MAIN PHOTO</span>
//                   </>
//                 )}
//                 <input type="file" name="image" accept="image/*" onChange={handleChange} 
//                   className="absolute inset-0 opacity-0 cursor-pointer" required={!preview} />
//               </div>
              
//               <label className="block bg-black text-white text-center py-2.5 rounded-xl text-xs font-medium cursor-pointer hover:bg-gray-800 transition-colors">
//                 <Plus size={14} className="inline mr-1" /> Browse Gallery
//                 <input type="file" name="images" accept="image/*" multiple onChange={handleChange} className="hidden" />
//               </label>
//             </div>
//           </div>

//           {/* Section 4: Price & Category */}
//           <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
//              <div>
//                 <label className="text-[11px] font-medium text-gray-400 uppercase mb-3 block tracking-widest">Pricing (USD)</label>
//                 <div className="space-y-3">
//                    <div className="relative">
//                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">$</span>
//                      <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Regular Price"
//                        className="w-full pl-8 pr-4 py-3 bg-[#fcfcfc] border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm font-medium" required />
//                    </div>
//                    <input name="sale_price" type="number" value={formData.sale_price} onChange={handleChange} placeholder="Sale Price (Optional)"
//                      className="w-full px-4 py-3 bg-[#fcfcfc] border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm font-medium text-emerald-600 placeholder:text-gray-300" />
//                 </div>
//              </div>

//              <div>
//                 <label className="text-[11px] font-medium text-gray-400 uppercase mb-3 block tracking-widest">Organization</label>
//                <select name="category" onChange={handleChange} required>
//   <option value="">Select Category</option>

//   {categories.map(cat => (
//     cat.subcategories.length > 0 ? (
//       <optgroup key={cat.id} label={cat.name}>
//         {cat.subcategories.map(sub => (
//           <option key={sub.id} value={sub.id}>
//             {sub.name}
//           </option>
//         ))}
//       </optgroup>
//     ) : (
//       <option key={cat.id} value={cat.id}>
//         {cat.name}
//       </option>
//     )
//   ))}
// </select>
//              </div>

//              <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-medium text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:bg-gray-200">
//                 {loading ? "Publishing..." : "Publish Product"}
//              </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import api from "../api";
import { toast, Toaster } from "react-hot-toast";
import { Package, Tag, DollarSign, Box, Image as ImageIcon, Plus, Info } from "lucide-react";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    stock: "",
    sku: "",
    category: "",
    tags: [], // Added tags array
    length: "",
    width: "",
    height: "",
    weight: "",
    image: null,
    images: [],
  });

  useEffect(() => {
    // Fetch both categories and tags concurrently
    Promise.all([
      api.get("products/categories/"),
      api.get("products/tags/")
    ]).then(([catRes, tagRes]) => {
      setCategories(catRes.data);
      setAvailableTags(tagRes.data);
    }).catch(() => toast.error("Failed to load initial data"));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file)); 
    } else if (name === "images") {
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleTag = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
   Object.entries(formData).forEach(([key, value]) => {
  if (key === "images") {
    Array.from(value).forEach(img => data.append("images", img));
  } else if (key === "tags") {
    value.forEach(tagId => data.append("tags", tagId));
  } else if (value !== "" && value !== null) {
    if (["price","sale_price","stock","length","width","height","weight"].includes(key)) {
      data.append(key, Number(value));
    } else {
      data.append(key, value);
    }
  }
});

    try {
      await api.post("products/items/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product published successfully");
      
      setFormData({
        name: "", description: "", price: "", sale_price: "",
        stock: "", sku: "", category: "", tags: [], length: "",
        width: "", height: "", weight: "", image: null, images: [],
      });
      setPreview(null);
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-medium text-black tracking-tight">Create Product</h2>
          <p className="text-sm text-gray-400 mt-1 font-normal">List a new item in your store catalog.</p>
        </div>
        <Package className="text-gray-200" size={40} strokeWidth={1} />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: General Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Info size={16} />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em]">General Information</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Product Title</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Minimalist Silk Dress"
                  className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-medium text-sm" required />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Write about the materials, fit, and style..."
                  className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all font-normal text-sm resize-none" required />
              </div>
            </div>
          </div>

          {/* Section 2: Inventory & Logistics */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Box size={16} />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Inventory & Dimensions</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Available Stock</label>
                <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="0"
                  className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm font-medium" required />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">SKU / Model Number</label>
                <input name="sku" value={formData.sku} onChange={handleChange} placeholder="PROD-100"
                  className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['length', 'width', 'height', 'weight'].map((dim) => (
                <div key={dim}>
                  <label className="text-[10px] font-medium text-gray-400 uppercase mb-2 block">{dim}</label>
                  <input name={dim} type="number" value={formData[dim]} onChange={handleChange} placeholder="0.0"
                    className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          
          {/* Section 3: Media */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <ImageIcon size={16} />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Media</span>
            </div>
            
            <div className="space-y-4">
              <div className="aspect-square w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-gray-200 mb-2" size={32} />
                    <span className="text-[10px] text-gray-400 font-medium">MAIN PHOTO</span>
                  </>
                )}
                <input type="file" name="image" accept="image/*" onChange={handleChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer" required={!preview} />
              </div>
              
              <label className="block bg-black text-white text-center py-2.5 rounded-xl text-xs font-medium cursor-pointer hover:bg-gray-800 transition-colors">
                <Plus size={14} className="inline mr-1" /> Browse Gallery
                <input type="file" name="images" accept="image/*" multiple onChange={handleChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Section 4: Organization & Pricing */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
             
             <div>
                <label className="text-[11px] font-medium text-gray-400 uppercase mb-3 block tracking-widest">Organization</label>
                <select name="category" value={formData.category} onChange={handleChange} required
                  className="w-full bg-[#fcfcfc] border border-gray-100 p-3 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm font-medium mb-4"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    cat.subcategories.length > 0 ? (
                      <optgroup key={cat.id} label={cat.name}>
                        {cat.subcategories.map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </optgroup>
                    ) : (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    )
                  ))}
                </select>

                {/* Tags Interface */}
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Tag size={12}/> Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => {
                    const isSelected = formData.tags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          isSelected 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                        }`}
                      >
                        {tag.name}
                      </button>
                    )
                  })}
                  {availableTags.length === 0 && <span className="text-xs text-gray-400 italic">No tags available.</span>}
                </div>
             </div>

             <div className="pt-4 border-t border-gray-100">
                <label className="text-[11px] font-medium text-gray-400 uppercase mb-3 block tracking-widest">Pricing (USD)</label>
                <div className="space-y-3">
                   <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">$</span>
                     <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Regular Price"
                       className="w-full pl-8 pr-4 py-3 bg-[#fcfcfc] border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm font-medium" required />
                   </div>
                   <input name="sale_price" type="number" value={formData.sale_price} onChange={handleChange} placeholder="Sale Price (Optional)"
                     className="w-full px-4 py-3 bg-[#fcfcfc] border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm font-medium text-emerald-600 placeholder:text-gray-300" />
                </div>
             </div>

             <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-medium text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:bg-gray-200">
                {loading ? "Publishing..." : "Publish Product"}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
}