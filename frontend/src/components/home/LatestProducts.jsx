import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function LatestProducts({ products, loading, tag }) {

  // ✅ Filter products by tag
  const filteredProducts = products.filter((product) =>
    product.tags?.map(t => t.toLowerCase()).includes(tag.toLowerCase())
  );

  // ❌ If no products → don't show component
  if (!loading && filteredProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">

      {/* ✅ SAME DESIGN (like your screenshot) */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            {tag}
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
            THE LATEST.
          </h2>
        </div>

        <Link
          to={`/products?tag=${tag}`}
          className="hidden sm:block text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition"
        >
          View All
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {filteredProducts.slice(0, 10).map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                id={product.id}
                title={product.name}
                imageUrl={product.image}
                price={product.price}
                salePrice={product.sale_price}
                category={product.category?.name}
                averageRating={product.average_rating}
                stock={product.stock}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}