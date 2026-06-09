import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast, Toaster } from "react-hot-toast";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load existing category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`products/categories/${id}/`);
        setName(res.data.name);
        setParent(res.data.parent?.id || "");
      } catch (err) {
        toast.error("Error loading category data");
      }
    };
    fetchCategory();

    // Load all categories for parent selection
    const fetchCategoriesList = async () => {
      try {
        const res = await api.get("products/categories/");
        setCategories(res.data.filter((cat) => cat.id !== parseInt(id))); // exclude self
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategoriesList();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`products/categories/${id}/`, {
        name,
        parent: parent || null,
      });
      toast.success("Category updated successfully");
      // Delay navigation slightly so user can see the success toast
      setTimeout(() => navigate("/admin/categories"), 1500);
    } catch (err) {
      console.error(err.response || err);
      toast.error("Update failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[600px] bg-[#fafafa] p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-black tracking-tight">
              Edit Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Modify details for <span className="text-black font-semibold">"{name}"</span>
            </p>
          </div>
          <button 
            onClick={() => navigate("/admin/categories")}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>

          {/* Parent Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Parent Category
            </label>
            <div className="relative">
              <select
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
              >
                <option value="">-- No parent (Main Category) --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-lg transition-all duration-200 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "SAVE CHANGES"
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="w-full bg-white border border-gray-200 text-gray-500 hover:text-black hover:border-black font-bold py-3 rounded-lg text-sm transition-all"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}