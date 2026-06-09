import React, { useEffect, useState } from "react";
import privateApi from "../api/privateApi";
import publicApi from "../api/publicApi";
import { toast, Toaster } from "react-hot-toast";
import { Plus, Edit3, Trash2, Tag, X } from "lucide-react";

const AdminTags = () => {
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);
  const [editingTagId, setEditingTagId] = useState(null);

  // ==========================
  // 🔹 FETCH TAGS
  // ==========================
  const fetchTags = async () => {
    try {
      const res = await publicApi.get("products/tags/");
      setTags(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load tags");
    }
  };

  // ==========================
  // 🔹 CREATE / UPDATE TAG
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    try {
      if (editingTagId) {
        // ✏️ UPDATE
        await privateApi.put(`products/tags/${editingTagId}/`, {
          name,
        });
        toast.success("Tag updated successfully");
      } else {
        // ➕ CREATE
        await privateApi.post("products/tags/", { name });
        toast.success("Tag added successfully");
      }

      setName("");
      setEditingTagId(null);
      fetchTags();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Error saving tag");
    }
  };

  // ==========================
  // 🔹 EDIT CLICK
  // ==========================
  const handleEdit = (tag) => {
    setName(tag.name);
    setEditingTagId(tag.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setName("");
    setEditingTagId(null);
  }

  // ==========================
  // 🔹 DELETE TAG
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;

    try {
      await privateApi.delete(`products/tags/${id}/`);
      toast.success("Tag deleted");
      fetchTags();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Error deleting tag");
    }
  };

  // ==========================
  // 🔹 LOAD ON START
  // ==========================
  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-4 px-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-3xl font-medium text-black tracking-tight">Manage Tags</h2>
          <p className="text-sm text-gray-400 mt-1 font-normal">Create and organize keywords to help filter products.</p>
        </div>
      </div>

      {/* Form Area */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 mb-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Tag size={16} />
            </div>
            <input
              type="text"
              placeholder="Enter tag name (e.g., 'Bestseller', 'New Arrival')"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <button 
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              {editingTagId ? (
                <>
                  <Edit3 size={16} />
                  Update Tag
                </>
              ) : (
                <>
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  Add Tag
                </>
              )}
            </button>
            
            {editingTagId && (
              <button 
                type="button"
                onClick={cancelEdit}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfcfc] border-b border-gray-100">
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]">Tag Name</th>
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em]">Slug</th>
              <th className="px-8 py-5 text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tags.map((tag) => (
              <tr key={tag.id} className="bg-white hover:bg-gray-50/50 transition-all duration-200 group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-black">
                      <Tag size={16} />
                    </div>
                    <span className="font-medium text-gray-800 text-[15px]">{tag.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide bg-gray-100 text-gray-600">
                    {tag.slug}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {tags.length === 0 && (
          <div className="py-24 text-center">
            <Tag className="mx-auto h-12 w-12 text-gray-100 mb-4" strokeWidth={1} />
            <h3 className="text-sm font-medium text-gray-900">No tags found</h3>
            <p className="mt-1 text-sm text-gray-400 font-normal">Start by creating your first product tag above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTags;