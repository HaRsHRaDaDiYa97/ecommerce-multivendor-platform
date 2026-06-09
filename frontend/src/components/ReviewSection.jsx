import React, { useEffect, useState } from "react";
import { Star, Trash2, MessageSquare, CheckCircle, User } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import publicApi from "../api/publicApi";
import privateApi from "../api/privateApi";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const fetchReviews = async () => {
    try {
      const res = await publicApi.get("reviews/items/", { params: { product: productId } });
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to load reviews");
    }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const submitReview = async () => {
    if (!rating) return alert("Please select rating");
    try {
      setLoading(true);
      const res = await privateApi.post("reviews/items/", { product: productId, rating, comment });
      setReviews((prev) => [res.data, ...prev]);
      setRating(0);
      setComment("");
    } catch (err) {
      alert("You already reviewed this product");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await privateApi.delete(`reviews/items/${id}/`);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch {
      alert("Not allowed");
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="mt-16 sm:mt-24 border-t border-gray-100 pt-12 sm:pt-16 max-w-6xl mx-auto px-4 sm:px-6">

      {/* HEADER & SUMMARY */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-600">{avgRating} out of 5</span>
            <span className="text-gray-400 text-sm">• {reviews.length} Global Ratings</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT SIDE: POST A REVIEW (Now Sticky & Theme-Consistent) */}
        <div className="lg:col-span-5 order-1">
          {isAuthenticated ? (
            <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Share your thoughts</h3>

              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Your Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(n)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        size={32}
                        className={`transition-colors duration-200 ${(hoverRating || rating) >= n ? "fill-amber-400 text-amber-400" : "text-gray-200"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Review Comment</p>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you think about the quality and fit?"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                />
              </div>

              <button
                onClick={submitReview}
                disabled={loading || !rating}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2"
              >
                {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Submit Review"}
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 p-8 rounded-3xl text-center sticky top-24">
              <User className="mx-auto text-gray-400 mb-3" size={32} />
              <p className="text-gray-700 font-bold mb-4 text-sm">Sign in to leave a review</p>
              <Link to="/login">
                <button className="text-emerald-600 font-bold text-sm hover:underline">
                  Login to your account →
                </button>
              </Link>

            </div>
          )}
        </div>

        {/* RIGHT SIDE: REVIEWS LIST */}
        <div className="lg:col-span-7 order-2">
          {reviews.length === 0 ? (
            <div className="py-20 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              <MessageSquare className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((r) => (
                <div key={r.id} className="pb-8 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                        {r.user_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{r.user_name}</span>
                          <CheckCircle size={14} className="text-emerald-500" />
                          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Verified</span>
                        </div>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {isAuthenticated && user?.id === r.user && (
                      <button onClick={() => deleteReview(r.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed pl-13">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}