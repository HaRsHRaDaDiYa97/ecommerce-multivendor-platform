// src/components/home/ProductCarousel.jsx
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function ProductCarousel({ title, subtitle, products, loading, viewAllLink }) {
  // If not loading and no products match this tag, don't show the section at all
  if (!loading && (!products || products.length === 0)) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 overflow-hidden">
      
      <div className="flex items-end justify-between mb-10">
        <div>
          {subtitle && (
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
            {title}
          </h2>
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="hidden sm:block text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition"
          >
            View All
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[60vw] sm:min-w-[40vw] md:min-w-[28vw] lg:min-w-[22vw] space-y-4 animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <Swiper
            spaceBetween={16}
            slidesPerView={1.5} 
            breakpoints={{
              640: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 3.5, spaceBetween: 24 },
              1280: { slidesPerView: 4.5, spaceBetween: 24 },
            }}
            className="w-full !pb-8"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard
                  id={product.id}
                  title={product.name}
                  imageUrl={product.images?.[0]?.image || "/placeholder.png"}
                  price={product.price}
                  salePrice={product.sale_price}
                  category={product.category?.name}
                  averageRating={product.average_rating}
                  stock={product.stock}
                  tags={product.tags} // Pass tags to card for the badge
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to={viewAllLink || "/products"}
              className="inline-block border border-black px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform"
            >
              View Collection
            </Link>
          </div>
        </>
      )}
    </section>
  );
}