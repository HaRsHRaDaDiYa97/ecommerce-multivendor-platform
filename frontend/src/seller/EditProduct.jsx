// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";
// import { toast, Toaster } from "react-hot-toast";
// import { ChevronLeft, Upload, Image as ImageIcon, Plus, Save, Package, Box } from "lucide-react";

// export default function EditProduct() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState({
//     name: "", sku: "", description: "", price: "", sale_price: "",
//     stock: "", weight: "", length: "", width: "", height: "",
//     category: "", image: null, images: [],
//   });

//   const [categories, setCategories] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Logic remains identical to your original code
//   const fetchProduct = async () => {
//     try {
//       const res = await api.get(`products/items/${id}/`);
//       const data = res.data;
//       setProduct({
//         name: data.name || "", sku: data.sku || "", description: data.description || "",
//         price: data.price || "", sale_price: data.sale_price || "", stock: data.stock || "",
//         weight: data.weight || "", length: data.length || "", width: data.width || "",
//         height: data.height || "", category: data.category?.id || "",
//         image: null, images: [],
//       });
//       setExistingImages(data.images || []);
//     } catch (err) {
//       toast.error("Failed to load product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await api.get("products/categories/");
//       const subcategories = [];
//       res.data.forEach(cat => {
//         if (cat.subcategories && cat.subcategories.length > 0) {
//           subcategories.push(...cat.subcategories);
//         } else {
//           subcategories.push(cat);
//         }
//       });
//       setCategories(subcategories);
//     } catch (err) {
//       toast.error("Failed to load categories");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchProduct();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProduct(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     setProduct(prev => ({ ...prev, image: e.target.files[0] }));
//   };

//   const handleMultipleImagesChange = (e) => {
//     setProduct(prev => ({ ...prev, images: Array.from(e.target.files) }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     for (const key in product) {
//       if (key === "images") {
//         product.images.forEach(img => formData.append("images", img));
//       } else {
//         if (product[key] !== null) formData.append(key, product[key]);
//       }
//     }
//     try {
//       await api.put(`products/items/${id}/`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Product updated successfully");
//       navigate("/seller-panel/my-products");
//     } catch (err) {
//       toast.error("Update failed");
//     }
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
//     </div>
//   );

//   return (
//     <div className="max-w-6xl mx-auto py-8 px-6 bg-white min-h-screen">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="flex items-center justify-between mb-10">
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={() => navigate(-1)} 
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <div>
//             <h2 className="text-2xl font-medium tracking-tight uppercase">Edit Product</h2>
//             <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Product ID: #{id}</p>
//           </div>
//         </div>
//         <button 
//           form="edit-form"
//           type="submit" 
//           className="bg-black text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2"
//         >
//           <Save size={16} /> Save Changes
//         </button>
//       </div>

//       <form id="edit-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

//         {/* Left Column: Visuals */}
//         <div className="lg:col-span-5 space-y-8">
//           {/* Main Image Selection */}
//           <div className="border border-gray-100 rounded-3xl p-6 bg-[#fcfcfc]">
//             <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Main Display Image</label>
//             <div className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 hover:border-black transition-colors">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="absolute inset-0 opacity-0 cursor-pointer z-10"
//               />
//               <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-black transition-colors">
//                 <Upload size={32} strokeWidth={1.5} />
//                 <span className="text-[10px] font-bold mt-2 uppercase">Click to Replace</span>
//               </div>
//               {product.image && (
//                 <div className="absolute inset-0 bg-white pointer-events-none">
//                    <img src={URL.createObjectURL(product.image)} className="w-full h-full object-cover" alt="new" />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Gallery Management */}
//           <div className="border border-gray-100 rounded-3xl p-6">
//             <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Current Gallery</label>
//             <div className="grid grid-cols-4 gap-3">
//               {existingImages.map(img => (
//                 <img key={img.id} src={img.image} className="aspect-square object-cover rounded-xl border border-gray-100" alt="existing" />
//               ))}
//               <label className="aspect-square rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:border-black hover:text-black cursor-pointer transition-all">
//                 <Plus size={20} />
//                 <input type="file" accept="image/*" multiple onChange={handleMultipleImagesChange} className="hidden" />
//               </label>
//             </div>
//             <p className="text-[10px] text-gray-400 mt-4 italic font-medium">* Adding new images will overwrite the current gallery</p>
//           </div>
//         </div>

//         {/* Right Column: Details */}
//         <div className="lg:col-span-7 space-y-6">
//           <div className="bg-gray-50/50 rounded-3xl p-8 space-y-6 border border-gray-50">

//             {/* Essential Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-1">
//                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Name</label>
//                 <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-medium transition-all" />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU Number</label>
//                 <input type="text" name="sku" value={product.sku} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-medium transition-all" />
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
//               <select name="category" value={product.category} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-medium transition-all appearance-none">
//                 <option value="">Select Subcategory</option>
//                 {categories.map(cat => (
//                   <option key={cat.id} value={cat.id}>{cat.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="space-y-1">
//               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Description</label>
//               <textarea name="description" rows="4" value={product.description} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-normal text-sm resize-none leading-relaxed" />
//             </div>

//             {/* Pricing & Stock */}
//             <div className="grid grid-cols-3 gap-6">
//               <div className="space-y-1">
//                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price (₹)</label>
//                 <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-bold" />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sale (₹)</label>
//                 <input type="number" name="sale_price" value={product.sale_price} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-bold text-emerald-600" />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory</label>
//                 <input type="number" name="stock" value={product.stock} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-bold" />
//               </div>
//             </div>

//             {/* Logistics */}
//             <div className="pt-6 border-t border-gray-200 space-y-4">
//               <h4 className="text-[11px] font-bold text-black uppercase tracking-[0.2em] flex items-center gap-2">
//                 <Box size={14} /> Shipping Dimensions
//               </h4>
//               <div className="grid grid-cols-4 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Length</label>
//                   <input type="number" name="length" value={product.length} onChange={handleChange} className="w-full bg-white border-none p-3 rounded-lg text-sm outline-none" />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Width</label>
//                   <input type="number" name="width" value={product.width} onChange={handleChange} className="w-full bg-white border-none p-3 rounded-lg text-sm outline-none" />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Height</label>
//                   <input type="number" name="height" value={product.height} onChange={handleChange} className="w-full bg-white border-none p-3 rounded-lg text-sm outline-none" />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Weight</label>
//                   <input type="number" name="weight" value={product.weight} onChange={handleChange} className="w-full bg-white border-none p-3 rounded-lg text-sm outline-none" />
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }






import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast, Toaster } from "react-hot-toast";
import { ChevronLeft, Upload, Image as ImageIcon, Plus, Save, Package, Box, Tag } from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "", sku: "", description: "", price: "", sale_price: "",
    stock: "", weight: "", length: "", width: "", height: "",
    category: "", tags: [], image: null, images: [],
  });

  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`products/items/${id}/`);
      const data = res.data;
      setProduct({
        name: data.name || "", sku: data.sku || "", description: data.description || "",
        price: data.price || "", sale_price: data.sale_price || "", stock: data.stock || "",
        weight: data.weight || "", length: data.length || "", width: data.width || "",
        height: data.height || "", category: data.category?.id || "",
        tags: data.tags ? data.tags.map(t => t.id) : [], // Extract existing tag IDs
        image: null, images: [],
      });
      setExistingImages(data.images || []);
    } catch (err) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        api.get("products/categories/"),
        api.get("products/tags/")
      ]);

      const subcategories = [];
      catRes.data.forEach(cat => {
        if (cat.subcategories && cat.subcategories.length > 0) {
          subcategories.push(...cat.subcategories);
        } else {
          subcategories.push(cat);
        }
      });

      setCategories(subcategories);
      setAvailableTags(tagRes.data);
    } catch (err) {
      toast.error("Failed to load categories or tags");
    }
  };

  useEffect(() => {
    fetchDependencies().then(() => fetchProduct());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProduct(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleMultipleImagesChange = (e) => {
    setProduct(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const toggleTag = (tagId) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in product) {
      if (key === "images") {
        product.images.forEach(img => formData.append("images", img));
      } else if (key === "tags") {
        product.tags.forEach(tagId => formData.append("tags", tagId)); // Append each tag ID
      } else {
        if (product[key] !== null) formData.append(key, product[key]);
      }
    }

    try {
      await api.put(`products/items/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully");
      navigate("/seller-panel/my-products");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 bg-white min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-medium tracking-tight uppercase">Edit Product</h2>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Product ID: #{id}</p>
          </div>
        </div>
        <button
          form="edit-form"
          type="submit"
          className="bg-black text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <form id="edit-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Column: Visuals */}
        <div className="lg:col-span-5 space-y-8">
          {/* Main Image Selection */}
          <div className="border border-gray-100 rounded-3xl p-6 bg-[#fcfcfc]">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Main Display Image</label>
            <div className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 hover:border-black transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                <Upload size={32} strokeWidth={1.5} />
                <span className="text-[10px] font-bold mt-2 uppercase">Click to Replace</span>
              </div>
              {product.image && (
                <div className="absolute inset-0 bg-white pointer-events-none">
                  <img src={URL.createObjectURL(product.image)} className="w-full h-full object-cover" alt="new" />
                </div>
              )}
            </div>
          </div>

          {/* Gallery Management */}
          <div className="border border-gray-100 rounded-3xl p-6">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Current Gallery</label>
            <div className="grid grid-cols-4 gap-3">
              {existingImages.map((img, index) => (
                <img
                  key={`img-${index}`}
                  src={img.image.startsWith("http") ? img.image : `http://127.0.0.1:8000${img.image}`}
                  className="aspect-square object-cover rounded-xl border border-gray-100"
                  alt="existing"
                />
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:border-black hover:text-black cursor-pointer transition-all">
                <Plus size={20} />
                <input type="file" accept="image/*" multiple onChange={handleMultipleImagesChange} className="hidden" />
              </label>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 italic font-medium">* Adding new images will overwrite the current gallery</p>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gray-50/50 rounded-3xl p-8 space-y-6 border border-gray-50">

            {/* Essential Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Name</label>
                <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-medium transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU Number</label>
                <input type="text" name="sku" value={product.sku} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-medium transition-all" />
              </div>
            </div>

            {/* Category & Tags Row */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                <select name="category" value={product.category} onChange={handleChange}>
                  <option value="">Select Subcategory</option>
                  {categories.map((cat, index) => (
  <option
    key={`${cat.id}-${cat.name}-${index}`}
    value={cat.id}>
    {cat.name}
  </option>
))}
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Tag size={12} /> Product Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag, index) => {
                    const isSelected = product.tags.includes(tag.id);
                    return (
                      <button
                        key={`${tag.id}-${tag.name}-${index}`} // ✅ unique key
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${isSelected
                          ? 'bg-black text-white border-black shadow-md shadow-black/10'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                          }`}
                      >
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Description</label>
              <textarea name="description" rows="4" value={product.description} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-normal text-sm resize-none leading-relaxed" />
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price (₹)</label>
                <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sale (₹)</label>
                <input type="number" name="sale_price" value={product.sale_price} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-bold text-emerald-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory</label>
                <input type="number" name="stock" value={product.stock} onChange={handleChange} className="w-full bg-white border-none p-4 rounded-xl focus:ring-1 focus:ring-black outline-none font-bold" />
              </div>
            </div>

            {/* Logistics */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <h4 className="text-[11px] font-bold text-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Box size={14} /> Shipping Dimensions
              </h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Length</label>
                  <input type="number" name="length" value={product.length} onChange={handleChange} className="w-full bg-white border-none p-3 rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Width</label>
                  <input type="number" name="width" value={product.width} onChange={handleChange} className="w-full bg-white border-none p-3 rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Height</label>
                  <input type="number" name="height" value={product.height} onChange={handleChange} className="w-full bg-white border-none p-3 rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Weight</label>
                  <input type="number" name="weight" value={product.weight} onChange={handleChange} className="w-full bg-white border-none p-3 rounded-lg text-sm outline-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}