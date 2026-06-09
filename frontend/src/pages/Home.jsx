import { useEffect, useState } from "react";
import publicApi from "../api/publicApi";

import HeroSlider from "../components/home/HeroSlider";
import PromoSection from "../components/home/PromoSection";
import ProductCarousel from "../components/home/ProductCarousel";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both products and tags at the same time
    Promise.all([
      publicApi.get("products/items/"),
      publicApi.get("products/tags/")
    ])
      .then(([productsRes, tagsRes]) => {
        setProducts(productsRes.data.results || []); // ✅ Extract results array
        setTags(tagsRes.data);
        setLoading(false);
      })
      .catch(() => {
        console.log("Failed to load homepage data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <HeroSlider />

      {/* Base Section: Always show "The Latest" */}
      <ProductCarousel 
        title="The Latest." 
        subtitle="New Arrivals" 
        products={products.slice(0, 8)} 
        loading={loading} 
        viewAllLink="/products"
      />

      {/* DYNAMIC SECTIONS: Loop through tags */}
      {!loading && tags.map((tag) => {
        const taggedProducts = products.filter(product => {
          if (!product.tags) return false;
          return product.tags.some(t => typeof t === 'object' ? t.id === tag.id : t === tag.id);
        });

        if (taggedProducts.length === 0) return null;

        return (
          <ProductCarousel
            key={tag.id}
            title={tag.name}
            subtitle="Curated Collection"
            products={taggedProducts}
            loading={loading}
            viewAllLink={`/products?tag=${tag.slug}`}
          />
        );
      })}
    </div>
  );
}