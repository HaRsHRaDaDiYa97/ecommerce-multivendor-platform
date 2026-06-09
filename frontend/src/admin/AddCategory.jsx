import React, { useState, useEffect } from "react";
import api from "../api";
// Note: You can install 'react-hot-toast' or 'react-toastify' 
// I will use a simple console logic placeholder for the toast call
import { toast, Toaster } from "react-hot-toast"; 

export default function AddCategory() {
  const [name, setName] = useState("");
  const [parent, setParent] = useState(""); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("products/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    setLoading(true);
    try {
      await api.post("products/categories/", {
        name,
        parent: parent || null,
      });
      toast.success("Category added successfully!");
      setName("");
      setParent("");
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Failed to add category");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[600px] bg-[#fafafa] p-4">
      {/* Toast Container */}
      <Toaster position="top-right" />

      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-50">
          <h2 className="text-xl font-semibold text-black tracking-tight">
            Create Category
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Organize your store by adding new main or sub-categories.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Footwear"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Parent Category</label>
            <div className="relative">
              <select
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
              >
                <option value="">-- No parent (Main Category) --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {/* Custom Arrow Icon */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                "Save Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}