import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast, Toaster } from "react-hot-toast";
import { Plus, Edit3, Trash2, Layers } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await api.get("products/categories/");
      setCategories(res.data);
    } catch (err) {
      console.error(err.response || err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await api.delete(`products/categories/${id}/`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      console.error(err.response || err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-3xl font-medium text-black tracking-tight">Product Categories</h2>
          <p className="text-sm text-gray-400 mt-1 font-normal">Manage the structural hierarchy of your store items.</p>
        </div>
        <button
          onClick={() => navigate("/admin/add-category")}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          New Category
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfcfc] border-b border-gray-100">
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]">Category Name</th>
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]">Classification</th>
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <React.Fragment key={cat.id}>
                {/* Main Category Row */}
                <tr className="bg-white hover:bg-gray-50/50 transition-all duration-200 group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-black">
                        <Layers size={16} />
                      </div>
                      <span className="font-medium text-gray-800 text-[15px]">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider bg-black text-white">
                      Parent
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => navigate(`/admin/categories/edit/${cat.id}`)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Subcategories Row */}
                {cat.subcategories?.map((sub) => (
                  <tr key={sub.id} className="bg-[#fdfdfd] hover:bg-gray-50 transition-all duration-200 group">
                    <td className="px-8 py-4 pl-16 flex items-center gap-3">
                      <div className="w-4 h-4 border-l border-b border-gray-200 rounded-bl-md -mt-3"></div>
                      <span className="text-gray-500 text-sm font-normal">{sub.name}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Sub-Category</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => navigate(`/admin/categories/edit/${sub.id}`)}
                          className="p-1.5 text-gray-300 hover:text-black transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteCategory(sub.id)}
                          className="p-1.5 text-red-200 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="py-24 text-center">
            <Layers className="mx-auto h-12 w-12 text-gray-100 mb-4" strokeWidth={1} />
            <h3 className="text-sm font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-sm text-gray-400 font-normal">Start by creating your first product category.</p>
          </div>
        )}
      </div>
    </div>
  );
}