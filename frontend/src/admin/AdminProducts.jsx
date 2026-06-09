import React, { useEffect, useState } from "react";
import api from "../api";
import { toast, Toaster } from "react-hot-toast";
import { Trash2, Edit3, Package, Star, Search, ChevronDown, ChevronUp, Box, Layers } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null); // Track which row is open

  const fetchProducts = async () => {
  try {
    const res = await api.get("products/items/");

    console.log("FULL RESPONSE:", res.data);

    // ✅ FIX HERE
    setProducts(
      Array.isArray(res.data.results) ? res.data.results : []
    );

  } catch (error) {
    toast.error("Failed to load products");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchProducts(); }, []);

  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const deleteProduct = async (id, e) => {
    e.stopPropagation(); // Prevent row from toggling when clicking delete
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`products/items/${id}/`);
      toast.success("Product removed");
      fetchProducts();
    } catch (error) { toast.error("Delete failed"); }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(products);


  return (
    <div className="max-w-7xl mx-auto py-4 px-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-medium text-black tracking-tight uppercase">Product Inventory</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <input
            type="text" placeholder="Search products..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfcfc] border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-medium text-gray-400 uppercase tracking-widest">Product Info</th>
              <th className="px-6 py-4 text-[11px] font-medium text-gray-400 uppercase tracking-widest">Pricing</th>
              <th className="px-6 py-4 text-[11px] font-medium text-gray-400 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-[11px] font-medium text-gray-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((p) => {
              const isExpanded = expandedId === p.id;
              return (
                <React.Fragment key={p.id}>
                  {/* Main Row */}
                  <tr
                    onClick={() => toggleRow(p.id)}
                    className={`cursor-pointer transition-colors duration-200 ${isExpanded ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            p.images && p.images.length > 0
                              ? p.images[0].image
                              : "https://via.placeholder.com/150"
                          }
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                          alt={p.name}
                        />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{p.category?.name || 'No Category'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">₹{p.price}</p>
                      {p.sale_price && <p className="text-xs text-emerald-500 font-medium italic">₹{p.sale_price}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${p.stock < 5 ? 'text-red-500' : 'text-gray-600'}`}>
                        {p.stock} Units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button onClick={(e) => deleteProduct(p.id, e)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                        {isExpanded ? <ChevronUp size={18} className="text-black" /> : <ChevronDown size={18} className="text-gray-300" />}
                      </div>
                    </td>
                  </tr>

                  {/* Expandable Content Row */}
                  <tr>
                    <td colSpan="4" className="p-0 border-none">
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100 border-b border-gray-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white">

                          {/* Left Side: Images & Description */}
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">Product Description</h4>
                              <p className="text-sm text-gray-600 leading-relaxed font-normal">{p.description}</p>
                            </div>

                            <div>
                              <h4 className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">Photo Gallery</h4>
                              <div className="flex flex-wrap gap-3">
                                {p.images?.map((img) => (
                                  <img key={img.id} src={img.image} className="w-20 h-20 rounded-xl object-cover border border-gray-100 hover:scale-110 transition-transform cursor-zoom-in" alt="gallery" />
                                ))}
                                {(!p.images || p.images.length === 0) && <p className="text-xs text-gray-300 italic">No additional images</p>}
                              </div>
                            </div>
                          </div>

                          {/* Right Side: Detailed Specs */}
                          <div className="bg-gray-50/50 rounded-2xl p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded-xl border border-gray-100">
                                <p className="text-[10px] text-gray-400 font-medium uppercase">SKU Number</p>
                                <p className="text-sm font-medium text-black">{p.sku || 'N/A'}</p>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-gray-100">
                                <p className="text-[10px] text-gray-400 font-medium uppercase">Performance</p>
                                <p className="text-sm font-medium text-black flex items-center gap-1">⭐ {p.average_rating}</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-[11px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Box size={14} /> Logistics Details
                              </h4>
                              <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div><span className="text-gray-400 font-normal">Weight:</span> <span className="font-medium ml-2">{p.weight} kg</span></div>
                                <div><span className="text-gray-400 font-normal">Length:</span> <span className="font-medium ml-2">{p.length} cm</span></div>
                                <div><span className="text-gray-400 font-normal">Width:</span> <span className="font-medium ml-2">{p.width} cm</span></div>
                                <div><span className="text-gray-400 font-normal">Height:</span> <span className="font-medium ml-2">{p.height} cm</span></div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200/50">
                              <p className="text-[10px] text-gray-400">Created: {new Date(p.created_at).toLocaleString()}</p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}