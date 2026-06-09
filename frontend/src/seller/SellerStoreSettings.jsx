import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"; // Added for Redux
import privateApi from "../api/privateApi";
import { fetchMyStore, updateMyStore } from "../features/store/storeApi";
import { setMyStore } from "../features/store/storeSlice"; // Import your action
import { Camera, Store, Info, Save, Plus, Image as ImageIcon, Loader2 } from "lucide-react";

const BASE_URL = 'http://127.0.0.1:8000';

export default function SellerStoreSettings() {
  const dispatch = useDispatch();
  const [store, setStore] = useState({
    name: "",
    description: "",
    logo: "",
    banner: "",
  });

  const [preview, setPreview] = useState({
    logo: "",
    banner: "",
  });

  const [storeExists, setStoreExists] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStore();
  }, []);

  const loadStore = async () => {
    try {
      setLoading(true);
      const data = await fetchMyStore();

      if (!data) {
        setStoreExists(false);
        dispatch(setMyStore(null)); // Sync Redux
        return;
      }

      setStoreExists(true);
      // Sync Redux State so Product Details can see the store
      dispatch(setMyStore(data)); 

      setStore({
        name: data.name || "",
        description: data.description || "",
        logo: data.logo || "",
        banner: data.banner || "",
      });

      setPreview({
        logo: data.logo
          ? data.logo.startsWith("http") ? data.logo : BASE_URL + data.logo
          : "",
        banner: data.banner
          ? data.banner.startsWith("http") ? data.banner : BASE_URL + data.banner
          : "",
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async () => {
    try {
      setLoading(true);
      await privateApi.post("/stores/create/", { name: "My Store" });
      await loadStore();
    } catch (err) {
      console.error("Create store error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStore({ ...store, [e.target.name]: file });
    setPreview({ ...preview, [e.target.name]: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", store.name);
      form.append("description", store.description);
      
      if (store.logo instanceof File) form.append("logo", store.logo);
      if (store.banner instanceof File) form.append("banner", store.banner);

      const updatedData = await updateMyStore(form);
      
      // Update Redux immediately with the response from the server
      dispatch(setMyStore(updatedData));
      
      await loadStore(); 
      alert("Store Updated Successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update store");
    } finally {
      setLoading(false);
    }
  };

  // --- UI RENDER (Logic preserved, Styling exactly as requested) ---

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-slate-900" size={40} />
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Updating Storefront</p>
    </div>
  );

  if (!storeExists) return (
    <div className="max-w-xl mx-auto mt-20 text-center p-12 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
      <div className="w-20 h-20 bg-slate-50 text-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Store size={40} />
      </div>
      <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">Store Not Found</h2>
      <button onClick={handleCreateStore} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 mx-auto">
        <Plus size={18} /> Create Store
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 pt-8">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-[2px] w-8 bg-slate-900"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Merchant Settings</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-slate-900">
          Store <span className="text-slate-300 italic">Identity</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          {/* Visual Preview Card */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm relative group">
            <div className="absolute top-4 right-4 z-20">
               <label className="cursor-pointer bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all border border-slate-100">
                  <Camera size={16} /> Edit Banner
                  <input type="file" name="banner" onChange={handleImage} className="hidden" />
               </label>
            </div>

            <div className="h-64 bg-slate-50 relative overflow-hidden">
              {preview.banner ? (
                <img src={preview.banner} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                  <ImageIcon size={48} strokeWidth={1} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="px-8 pb-8 relative">
              <div className="absolute -top-16 left-8">
                <div className="relative group/logo">
                  <div className="w-32 h-32 bg-white rounded-[2rem] p-1 shadow-2xl overflow-hidden border-4 border-white">
                    {preview.logo ? (
                      <img src={preview.logo} className="w-full h-full object-cover rounded-[1.8rem]" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300"><Store size={32} /></div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 cursor-pointer bg-slate-900 text-white p-2 rounded-xl shadow-xl border-4 border-white">
                    <Camera size={14} />
                    <input type="file" name="logo" onChange={handleImage} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="pt-20">
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">{store.name || "Unnamed Store"}</h2>
                <p className="text-slate-400 text-sm mt-2 font-medium line-clamp-2">{store.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Store Name</label>
              <input name="name" value={store.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
              <textarea name="description" value={store.description} onChange={handleChange} rows={5} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all resize-none" />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2">
              <Save size={18} /> Update Storefront
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}