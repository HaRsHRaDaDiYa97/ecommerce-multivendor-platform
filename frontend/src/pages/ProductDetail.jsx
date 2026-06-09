
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Heart,
  Store as StoreIcon, ChevronRight   // ✅ ADD THESE
} from "lucide-react";
import ReviewSection from "../components/ReviewSection";
import privateApi from "../api/privateApi";
import publicApi from "../api/publicApi";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";

// 2. IMPORT your store fetch function (adjust the path if needed)
import { fetchStoreBySlug } from "../features/store/storeApi";


export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart); // ✅ get cart from redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 3. ADD STATE to hold the fetched store profile
  const [storeData, setStoreData] = useState(null);



  // Fetch product & wishlist
  useEffect(() => {
    // 1. Fetch the Product
    publicApi.get(`products/items/${id}/`)
      .then(res => {
        setProduct(res.data);
         setMainImage(res.data.images?.[0]?.image || ""); 

        // ✅ CORRECT
        const slug = res.data.store_slug;


        if (slug) {
          fetchStoreBySlug(slug).then(data => {
            if (data) setStoreData(data);
          });
        }
      });

    // 3. Fetch Wishlist (Independent, can stay outside)
    if (isAuthenticated) {
      privateApi.get("/wishlist/")
        .then(res => {
          const exists = res.data.some(item => item.product.id === Number(id));
          setIsWishlisted(exists);
        })
        .catch(() => console.log("Failed to load wishlist"));
    }
  }, [id, isAuthenticated]);




  // ✅ Check if product is already in cart
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const exists = cartItems.some(item => item.product.id === Number(id));
      setAddedToCart(exists);
    }
  }, [cartItems, id]);

  const handleWishlist = async () => {
    try {
      if (!isWishlisted) {
        await privateApi.post("/wishlist/add/", { product_id: product.id });
        setIsWishlisted(true);
      } else {
        await privateApi.delete(`/wishlist/remove/${product.id}/`);
        setIsWishlisted(false);
      }
    } catch (err) {
      toast.info("Please login to use wishlist");
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return; // prevent add to cart if out of stock

    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      setAddedToCart(true);
      toast.success("Added to cart 🛒");
    } catch {
      toast.info("Please login to add items");
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock === 0) return; // prevent buy now if out of stock

    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      navigate("/checkout"); // or /cart
    } catch {
      toast.info("Please login to continue");
    }
  };


  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
      </div>
    );
  }

  const outOfStock = product?.stock === 0;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">

        {/* BREADCRUMB - Normalized Font */}
        <nav className="flex items-center text-[11px] text-gray-400 gap-2 mb-10 uppercase tracking-[0.2em] font-medium">
          <span className="hover:text-black cursor-pointer transition-colors">Home</span>
          <span className="text-gray-200">/</span>
          <span className="hover:text-black cursor-pointer transition-colors">{product.category?.name}</span>
          <span className="text-gray-200">/</span>
          <span className="text-black font-semibold truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* ================= LEFT: GALLERY ================= */}
          <div className="lg:col-span-7">
            <div className="sticky top-28 space-y-6">
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 group">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <button
                  onClick={handleWishlist}
                  className="absolute top-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all"
                >
                  <Heart
                    size={20}
                    className={isWishlisted ? "fill-red-500 text-red-500" : "text-black"}
                    strokeWidth={1.5}
                  />
                </button>

              </div>

              {/* Thumbnails */}
              {product.images?.length > 0 && (
  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
    {product.images.map((img, index) => (
      <button
        key={img.id || index}
        onClick={() => setMainImage(img.image)}
        className={`w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
          mainImage === img.image ? 'border-black' : 'border-transparent opacity-50'
        }`}
      >
        <img src={img.image} className="w-full h-full object-cover" alt={img.alt_text || product.name} />
      </button>
    ))}
  </div>
)}
            </div>
          </div>

          {/* ================= RIGHT: INFO ================= */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-[0.3em] mb-3">
                {product.category?.name || "Collection"}
              </p>
              <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-black leading-tight mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 py-2">
                {product.stock === 0 ? (
                  /* OUT OF STOCK - Clean, muted, but high-end */
                  <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200/50 px-4 py-2 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Currently Unavailable
                    </span>
                  </div>
                ) : product.stock < 5 ? (
                  /* LOW STOCK - Subtle urgency using Amber */
                  <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
                      Limited Stock: Only {product.stock} Left
                    </span>
                  </div>
                ) : (
                  /* IN STOCK - Vibrant but elegant Emerald */
                  <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                      In Stock · {product.stock} Units
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-1.5">
                  <Star className="fill-yellow-400 text-yellow-400" size={18} />
                  <span className="text-sm font-semibold text-black">{product.average_rating || "5.0"}</span>
                </div>
                <div className="h-4 w-[1px] bg-gray-200"></div>
                <button className="text-sm text-gray-500 font-medium hover:text-black transition-colors underline underline-offset-8">
                  {product.reviews?.length || 0} Reviews
                </button>
              </div>
            </div>


            {/* PRICE - Sophisticated Palette */}
            <div className="mb-10 p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100">
              <div className="flex items-baseline gap-4 mb-1">
                <span className="text-4xl font-semibold text-black tracking-tight">
                  ₹{product.sale_price || product.price}
                </span>
                {product.sale_price && (
                  <span className="text-xl text-gray-300 line-through font-light">
                    ₹{product.price}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Inclusive of all taxes</p>
                {product.sale_price && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    Save {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-10 px-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-black">The Detail</h3>
              <p className="text-gray-500 leading-relaxed text-base font-normal">
                {product.description}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4 mb-12">

              {/* ADD TO CART */}
              {/* ADD TO CART BUTTON */}
              <button
                onClick={handleAddToCart}
                disabled={addedToCart || outOfStock}
                className={`w-full h-16 rounded-2xl font-semibold uppercase tracking-[0.2em] text-[13px] flex items-center justify-center gap-3 transition-all duration-300
            ${addedToCart
                    ? "bg-green-600 text-white cursor-not-allowed"
                    : "bg-black text-white hover:opacity-90"
                  }
          `}
              >
                <ShoppingCart size={18} />
                {outOfStock ? "Out of Stock" : addedToCart ? "Added to Cart" : "Add to Cart"}
              </button>


              {/* BUY NOW */}
              <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className={`w-full border h-16 rounded-2xl font-semibold uppercase tracking-[0.2em] text-[13px] transition-all duration-500
    ${outOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                    : "border-black text-black hover:bg-black hover:text-white"
                  }
  `}
              >
                {outOfStock ? "Out of Stock" : "Buy Now"}
              </button>

            </div>


            {/* TRUST ELEMENTS */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="p-3 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <Truck size={20} strokeWidth={1.5} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="p-3 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <RotateCcw size={20} strokeWidth={1.5} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black">7 Day Return</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="p-3 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  <ShieldCheck size={20} strokeWidth={1.5} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black">Authentic</span>
              </div>
            </div>



            {/* NEW: STORE PROFILE CARD */}
            {/* NEW: STORE PROFILE CARD */}
            {storeData ? (
              <div
                onClick={() => navigate(`/store/${storeData.slug}`)} // slug from API
                className="mt-6 p-1 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-black transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between p-4 pl-6">
                  <div className="flex items-center gap-5">
                    {/* Store Logo */}
                    <div className="w-16 h-16 rounded-[1.2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner flex items-center justify-center">
                      {storeData.logo ? (  // use logo
                        <img
                          src={storeData.logo.startsWith('http') ? storeData.logo : `http://127.0.0.1:8000${storeData.logo}`}
                          alt={storeData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <StoreIcon size={24} className="text-gray-300" />
                      )}
                    </div>

                    {/* Store Info */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Official Merchant</p>
                      <h4 className="text-lg font-bold text-black group-hover:underline underline-offset-4 decoration-2">
                        {storeData.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Star size={12} className="fill-emerald-500 text-emerald-500" />
                        <span className="text-xs font-bold text-black">
                          {storeData.rating > 0 ? storeData.rating : 'New'}
                        </span>
                        <span className="text-xs font-medium text-gray-400">
                          ({storeData.total_reviews} Store Reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Icon */}
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors mr-2">
                    <ChevronRight size={20} strokeWidth={2} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-[11px] text-gray-400 font-medium mt-8">
                Curated and Sold by <span className="text-black font-bold">{product.seller}</span>
              </p>
            )}
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className=" border-t border-gray-50 pt-20">
          <ReviewSection productId={id} />
        </div>
      </div>
    </div>
  );
}