import React, { useEffect, useState } from "react";
import api from "../api";
import { toast, Toaster } from "react-hot-toast";
import {
  Package,
  Trash2,
  ChevronDown,
  Eye,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SellerMyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ---------------------------
  // Fetch Seller Products
  // ---------------------------
const fetchProducts = async () => {
  try {
    const res = await api.get("products/items/"); 
    console.log("API Response:", res.data);
    // Use res.data.results if it exists, else fallback to res.data
    setProducts(res.data.results || res.data); 
  } catch (error) {
    console.error("Failed to fetch products", error);
    toast.error("Could not load products");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------------------
  // Toggle expanded row
  // ---------------------------
  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // ---------------------------
  // Delete Product
  // ---------------------------
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`products/items/${id}/`);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // ---------------------------
  // Filter Products by Search
  // ---------------------------
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------------------------
  // Loading State
  // ---------------------------
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-4">
      <Toaster position="top-right" />

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-medium text-black tracking-tight uppercase">
            My Inventory
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-normal">
            Manage and track your active listings.
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Search your products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#fcfcfc] border border-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <Package className="mx-auto text-gray-300 mb-4" size={48} strokeWidth={1} />
          <p className="text-gray-500 font-medium">No products added yet.</p>
          <button className="mt-4 text-sm font-bold border-b-2 border-black pb-1 uppercase tracking-widest">
            Add First Product
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const isExpanded = expandedId === product.id;
            const mainImage = product.images?.[0]?.image || "/placeholder.png";

            return (
              <div
                key={product.id}
                className={`group bg-white border rounded-2xl transition-all duration-300 ${
                  isExpanded
                    ? "border-black shadow-lg"
                    : "border-gray-100 hover:border-gray-300"
                }`}
              >
                {/* Card Header */}
                <div
                  onClick={() => toggleRow(product.id)}
                  className="p-4 md:p-6 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-xl bg-gray-50"
                      />
                      <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                        {product.stock}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-lg text-black leading-tight mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-4">
                        <span className="text-black font-medium text-sm">
                          ₹{product.price}
                        </span>
                        <span className="text-gray-300 text-xs uppercase tracking-widest font-medium">
                          SKU: {product.sku || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => handleDelete(product.id, e)}
                      className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                      <ChevronDown className="text-gray-400" size={20} />
                    </div>
                  </div>
                </div>

                {/* Expandable Section */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? "max-h-[1000px] opacity-100 border-t border-gray-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 md:p-8 bg-[#fafafa]/50 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left: Description & Gallery */}
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
                          Description
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                      </div>

                      {product.images?.length > 0 && (
                        <div>
                          <h4 className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">
                            Gallery
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {product.images.map((img) => (
                              <img
                                key={img.id}
                                src={img.image}
                                className="w-20 h-20 rounded-xl object-cover border border-white shadow-sm hover:scale-105 transition-transform"
                                alt="gallery"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Specs */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                            Dimensions
                          </p>
                          <p className="text-sm font-medium text-black">
                            {product.length} × {product.width} × {product.height} cm
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                            Weight
                          </p>
                          <p className="text-sm font-medium text-black">{product.weight} kg</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                            Sale Price
                          </p>
                          <p className="text-sm font-medium text-emerald-600">
                            {product.sale_price ? `₹${product.sale_price}` : "No Active Sale"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                            Added On
                          </p>
                          <p className="text-sm font-medium text-black">
                            {new Date(product.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-50 flex gap-4">
                        <button
                          onClick={() => navigate(`/seller-panel/products/edit/${product.id}`)}
                          className="flex-1 bg-black text-white py-3 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                        >
                          Edit Product
                        </button>

                        <button className="px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                          <Eye size={18} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}