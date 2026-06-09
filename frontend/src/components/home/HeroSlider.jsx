import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      title: "Premium Watches",
      subtitle: "Timeless elegance for modern lifestyle",
      buttonText: "Shop Watches",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      title: "Latest Sneakers",
      subtitle: "Step into style and comfort",
      buttonText: "Shop Sneakers",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
      title: "Minimal Collection",
      subtitle: "Designed for everyday essentials",
      buttonText: "Explore Now",
    },
  ];

  return (
    <section className="relative h-[90vh] w-full">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        loop={true}
        speed={1000}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <img
                src={`${slide.image}?auto=format&fit=crop&w=1920&q=80`}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Buttons */}
        <div
          ref={prevRef}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full cursor-pointer transition"
        >
          <ChevronLeft className="text-white" size={24} />
        </div>

        <div
          ref={nextRef}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full cursor-pointer transition"
        >
          <ChevronRight className="text-white" size={24} />
        </div>
      </Swiper>
    </section>
  );
}
