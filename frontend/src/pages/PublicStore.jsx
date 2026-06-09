import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Store as StoreIcon, ShieldCheck, Mail, Phone, Heart, Info, ShoppingBag } from "lucide-react";
import publicApi from "../api/publicApi";
import privateApi from "../api/privateApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function PublicStore() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isFollowing, setIsFollowing] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchStoreData();
    fetchStoreProducts();
  }, [slug]);

  const fetchStoreData = async () => {
    try {
      const res = await publicApi.get(`/stores/${slug}/`);
      setStore(res.data);
    } catch (error) {
      toast.error("Store not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreProducts = async () => {
    try {
      const res = await publicApi.get(`/products/items/?store_slug=${slug}`);
      setProducts(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to load products");
    }
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated) return toast.info("Please login to follow stores");
    try {
      const res = await privateApi.post(`/stores/${slug}/follow/`);
      setIsFollowing(res.data.following);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.info("Please login to review");
    try {
      await privateApi.post(`/stores/${slug}/review/`, {
        rating: reviewRating,
        comment: reviewText
      });
      toast.success("Store review submitted!");
      setReviewText("");
      fetchStoreData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "You can only review stores you purchased from.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Storefront</p>
      </div>
    );
  }

  if (!store) return <div className="text-center py-20 text-xl font-bold">Store Not Found</div>;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">

      {/* --- BANNER SECTION --- */}
      <div className="w-full h-[250px] md:h-[350px] relative overflow-hidden">
        {store.banner ? (
          <img
            src={`http://localhost:8000${store.banner}`}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-200 via-slate-900 to-slate-900"></div>
            <span className="relative z-10 text-slate-700 font-black text-9xl tracking-tighter opacity-10 select-none uppercase">
              {store.name}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* --- RESTRUCTURED STORE HEADER --- */}
        {/* Removed negative margin from parent so text stays purely on the white background */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-12 relative">

          {/* LOGO - Isolated negative margin so only the logo pops over the banner */}
          <div className="-mt-16 md:-mt-20 flex justify-center md:justify-start z-20 shrink-0">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-white p-1.5 shadow-2xl border border-gray-100">
              <div className="w-full h-full bg-gray-50 rounded-[2rem] overflow-hidden flex items-center justify-center">
                {store.logo ? (
                  <img
                    src={`http://localhost:8000${store.logo}`}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <StoreIcon size={40} strokeWidth={1.5} />
                    <span className="text-[10px] font-black uppercase mt-1">Official</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TITLE & STATS - Safely sits below the banner line in a flex layout */}
          <div className="flex-1 pt-2 md:pt-4 z-10 w-full flex flex-col md:flex-row md:items-start justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase leading-none">
                  {store.name}
                </h1>
                {store.is_verified && <ShieldCheck className="text-blue-500 shrink-0" size={24} />}
              </div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                {store.tagline || "Verified Merchant Platform"}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-black">{store.rating || '0.0'}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {store.total_reviews || 0} Customer Reviews
                </span>
              </div>
            </div>

            <div className="flex justify-center md:justify-end shrink-0 pt-2">
              <button
                onClick={handleFollowToggle}
                className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-lg ${isFollowing
                    ? "bg-white text-black border border-gray-100 hover:bg-gray-50"
                    : "bg-black text-white hover:bg-zinc-800 shadow-black/20"
                  }`}
              >
                <Heart size={16} className={isFollowing ? "fill-black" : ""} />
                {isFollowing ? "Following" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">

          {/* --- LEFT: PRODUCTS --- */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-black" />
                <h2 className="text-xl font-black uppercase tracking-tight">Collection</h2>
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase">
                {products.length} Items Available
              </span>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {products.map((item) => (
                  <Link to={`/products/${item.id}`} key={item.id} className="group block">
                    <div className="aspect-[3/4] rounded-[2rem] bg-white border border-gray-100 overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500 relative">
                      <img
                       src={
                            item.images && item.images.length > 0
                              ? item.images[0].image
                              : "https://via.placeholder.com/150"
                          }
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        <p className="text-[10px] font-black text-black">₹{item.price}</p>
                      </div>
                    </div>
                    <h3 className="font-black text-xs uppercase tracking-tight truncate px-2">{item.name}</h3>
                    <p className="text-gray-400 text-[10px] font-bold mt-1 px-2 uppercase tracking-widest">Brand New</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info size={24} className="text-gray-300" />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">No inventory listed yet</p>
              </div>
            )}
          </div>

          {/* --- RIGHT: ABOUT & REVIEWS --- */}
          <div className="lg:col-span-4 order-1 lg:order-2 space-y-8">

            {/* About Box */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[4rem] -z-0"></div>
              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-gray-400">Merchant Bio</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium mb-8">
                  {store.description || "The merchant has not provided a business description yet. Rest assured, all verified merchants follow our strict quality guidelines."}
                </p>

                <div className="space-y-4 pt-6 border-t border-gray-50">
                  {store.support_email && (
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-tight text-gray-700 hover:text-black transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center"><Mail size={14} /></div> {store.support_email}
                    </div>
                  )}
                  {store.support_phone && (
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-tight text-gray-700">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center"><Phone size={14} /></div> {store.support_phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review Form Box */}
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-black/10">
              <h3 className="text-lg font-black uppercase tracking-tighter italic mb-6">Leave Feedback</h3>
              <form onSubmit={submitReview} className="space-y-5">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2 ml-1">Satisfaction Level</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-white/30 transition-all cursor-pointer"
                  >
                    <option className="text-black" value="5">Excellent ★★★★★</option>
                    <option className="text-black" value="4">Good ★★★★</option>
                    <option className="text-black" value="3">Average ★★★</option>
                    <option className="text-black" value="2">Poor ★★</option>
                    <option className="text-black" value="1">Terrible ★</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2 ml-1">Comments</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows={3}
                    placeholder="Describe your purchase experience..."
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-4 text-xs font-medium outline-none focus:ring-1 focus:ring-white/30 transition-all resize-none placeholder:text-gray-600"
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all shadow-xl shadow-white/5">
                  Submit Review
                </button>
              </form>
            </div>

            {/* Recent Reviews List */}
            <div className="px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-gray-400">Customer Voices</h3>
              <div className="space-y-4">
                {store.reviews?.length > 0 ? (
                  store.reviews.map((rev) => (
                    <div key={rev.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-[10px] uppercase tracking-tighter">{rev.user_name}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={`${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 border border-dashed border-gray-200 rounded-[2rem]">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Be the first to review</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}