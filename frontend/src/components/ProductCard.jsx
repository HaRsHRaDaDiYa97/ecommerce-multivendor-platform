

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowUpRight, Heart, Ban } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";

const ProductCard = ({ id, imageUrl, category, title, price, salePrice, averageRating, stock }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [liked, setLiked] = useState(false);




  useEffect(() => {
    setLiked(wishlistItems.includes(id));
  }, [wishlistItems, id]);

  const numericPrice = Number(price);
  const numericSalePrice = salePrice ? Number(salePrice) : null;
  const onSale = numericSalePrice && numericSalePrice < numericPrice;
  const outOfStock = stock === 0;

  const handleLike = async (e) => {
    e.preventDefault();
   

    const token = localStorage.getItem("access");
    if (!token) {
      toast.info("Please login to use wishlist");
      return;
    }

    setLiked(!liked); 

    try {
      if (liked) {
        await dispatch(removeFromWishlist(id)).unwrap();
        toast.success("Removed from wishlist ❤️");
      } else {
        await dispatch(addToWishlist(id)).unwrap();
        toast.success("Added to wishlist ❤️");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      setLiked(liked); 
    }
  };

  return (
    <div className="group relative bg-white w-full transition-all duration-300">
      
      {/* IMAGE SECTION */}
      <div className="relative aspect-[4/4] overflow-hidden bg-gray-50 rounded-[1.5rem] md:rounded-[2.5rem]">
        <Link to={`/products/${id}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />

        

         
        </Link>

        {/* WISHLIST BUTTON */}
       
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 md:top-6 md:right-6 p-2 md:p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-90 transition-all z-10"
          >
            <Heart
              size={16}
              className={liked ? "fill-red-500 text-red-500" : "text-gray-400"}
              strokeWidth={liked ? 0 : 2}
            />
          </button>
       

        {/* SALE TAG */}
        {onSale &&  (
          <div className="absolute top-3 left-3 md:top-6 md:left-6 bg-black text-white text-[9px] md:text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            Sale
          </div>
        )}
      </div>

      {/* DETAILS SECTION */}
      <div className="mt-5 px-1 md:px-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-[0.15em] font-bold">
            {category || "Essentials"}
          </span>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] text-gray-600 font-bold">
              {averageRating || "5.0"}
            </span>
          </div>
        </div>

        <Link to={`/products/${id}`} className="block mb-2">
          <h3 className="text-gray-900 font-medium text-sm md:text-xl tracking-tight line-clamp-1 hover:text-gray-600 transition-colors">
            {title}
          </h3>
        </Link>

        {/* PRICE SECTION */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg md:text-2xl font-semibold tracking-tighter text-black">
              ₹{onSale ? numericSalePrice : numericPrice}
            </span>
            {onSale && !outOfStock && (
              <span className="text-xs md:text-sm text-gray-300 line-through font-medium">
                ₹{numericPrice}
              </span>
            )}
          </div>

          {/* OPTIONAL STATUS TEXT FOR MOBILE */}
          {outOfStock && (
            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest border-b border-red-200">
             Out of stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;