
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/ProductCard";
import { fetchWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Local state to store wishlist data
  const [wishlistApiData, setWishlistApiData] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist())
        .unwrap()
        .then((data) => setWishlistApiData(data))
        .catch(() => console.error("Failed to fetch wishlist"));
    }
  }, [dispatch, isAuthenticated]);

  // Remove product immediately from page & store
  const handleRemove = async (productId) => {
    // 1️⃣ Remove from UI instantly
    setWishlistApiData(prev => prev.filter(item => item.product.id !== productId));

    try {
      // 2️⃣ Remove from backend/store
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success("Removed from wishlist ❤️");
    } catch {
      toast.error("Failed to remove item!");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gray-400">
          Curating your list
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="bg-gray-50 text-gray-900 px-8 py-4 rounded-2xl text-sm font-medium border border-gray-100">
          {error}
        </div>
      </div>
    );
  }

  const validItems = wishlistApiData.filter(item => item.product);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-gray-50 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400">
              <Heart size={14} className="fill-current text-red-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em]">Personal Favorites</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-black">
              Your Wishlist
            </h1>
            <p className="text-sm text-gray-500 font-normal">
              You have {validItems.length} curated {validItems.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>

          {validItems.length > 0 && (
            <Link to="/products" className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-widest text-black group transition-all">
              <span className="border-b border-black group-hover:border-gray-300 group-hover:text-gray-500 transition-all">Explore More</span>
              <ShoppingBag size={16} className="group-hover:text-gray-500" />
            </Link>
          )}
        </div>

        {/* Wishlist Content */}
        {validItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-[3rem] bg-gray-50/50 border border-gray-100">
            <div className="mb-6 p-6 bg-white rounded-full shadow-sm">
              <Heart size={40} strokeWidth={1} className="text-gray-200" />
            </div>
            <p className="text-xl text-gray-900 font-medium mb-2">The list is empty</p>
            <p className="text-gray-400 text-sm mb-10 max-w-[280px] text-center leading-relaxed">
              Start adding the items you love to keep track of them here.
            </p>
            <Link
              to="/products"
              className="bg-black text-white px-12 py-4 rounded-2xl text-[12px] font-semibold uppercase tracking-widest hover:bg-gray-800 transition-all"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in duration-1000">
            {validItems.map((item) => {
              const product = item.product;
              const fullImageUrl = product.images && product.images.length > 0
                ? product.images[0].image.startsWith("/")
                  ? `http://127.0.0.1:8000${product.images[0].image}`
                  : product.images[0].image
                : "/fallback.jpg"; // optional fallback
              return (
                <div key={product.id} className="relative group">
                  {/* ✅ Pass a prop for immediate remove */}
                  <ProductCard
                    id={product.id}
                    title={product.name}
                    imageUrl={fullImageUrl}
                    category={product.category?.name}
                    price={product.price}
                    salePrice={product.sale_price}
                    averageRating={product.average_rating}
                  />
                  {/* Immediate Remove Button */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-tight opacity-100 transition-all duration-300 shadow-sm border border-gray-100 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
