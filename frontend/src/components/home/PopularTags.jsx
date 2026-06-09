import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core Swiper styles
import publicApi from "../../api/publicApi";
import { Hash } from "lucide-react";
import { Link } from "react-router-dom";

export default function PopularTags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    publicApi.get("products/tags/")
      .then((res) => setTags(res.data))
      .catch((err) => console.error("Failed to load tags", err));
  }, []);

  if (tags.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-black">Trending Tags</h2>
          <p className="text-sm text-gray-500 mt-1">Explore popular categories and keywords.</p>
        </div>
      </div>

      <Swiper
        spaceBetween={16}
        slidesPerView={1.8} // ✅ Shows 1 full card + 80% of the next card on mobile
        breakpoints={{
          480: { slidesPerView: 2.5, spaceBetween: 16 },
          768: { slidesPerView: 4.5, spaceBetween: 20 },
          1024: { slidesPerView: 6.5, spaceBetween: 24 },
        }}
        className="w-full pb-4"
      >
        {tags.map((tag) => (
          <SwiperSlide key={tag.id}>
            <Link
              to={`/products?tag=${tag.slug}`}
              className="block group bg-gray-50/50 hover:bg-black border border-gray-100 hover:border-black rounded-[2rem] p-6 transition-all duration-300 text-center shadow-sm hover:shadow-xl hover:shadow-black/10"
            >
              <div className="w-14 h-14 mx-auto bg-white group-hover:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mb-4 transition-colors">
                <Hash size={20} className="text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-medium text-black group-hover:text-white transition-colors capitalize truncate">
                {tag.name}
              </h3>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}