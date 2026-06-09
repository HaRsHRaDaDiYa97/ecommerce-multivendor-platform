// import React, { useEffect, useState } from "react";
// import ProductCard from "../components/ProductCard";
// import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
// import publicApi from "../api/publicApi";

// export default function ProductPage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [sortField, setSortField] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [loading, setLoading] = useState(false);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await publicApi.get("products/items/", {
//         params: {
//           category: selectedCategory || undefined,
//           search: search || undefined,
//           ordering: sortField ? `${sortOrder === "desc" ? "-" : ""}${sortField}` : undefined,
//         },
//       });
//       setProducts(res.data);
//     } catch (err) {
//       console.error("Failed to fetch products", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await publicApi.get("products/categories/");
//       setCategories(res.data);
//     } catch (err) {
//       console.error("Failed to fetch categories");
//     }
//   };

//   useEffect(() => { fetchCategories(); }, []);
//   useEffect(() => { fetchProducts(); }, [selectedCategory, search, sortField, sortOrder]);

//   return (
//     <div className="bg-white min-h-screen py-6 md:py-10">
//       {/* HEADER SECTION */}
//       <header className=" pb-10 border-b border-black/5">
//         <div className="max-w-7xl mx-auto px-6">
//           <h1 className="text-6xl font-black text-black tracking-tighter mb-4">SHOP.</h1>
//           <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">
//             Discover our curated essentials
//           </p>
//         </div>
//       </header>

//       {/* SEARCH & FILTERS BAR */}
//       <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex flex-col md:flex-row gap-4 items-center">
            
//             {/* Minimalist Search */}
//             <div className="relative w-full md:flex-1">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search by product name..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-black transition-all"
//               />
//             </div>

//             <div className="flex w-full md:w-auto gap-2">
//               {/* Category Dropdown */}
//               <div className="relative flex-1 md:w-48">
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="w-full appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-full text-xs font-bold uppercase tracking-wider outline-none focus:border-black transition-colors"
//                 >
//                   <option value="">Categories</option>
//                   {categories.map(cat => (
//                     <option key={cat.id} value={cat.id}>{cat.name}</option>
//                   ))}
//                 </select>
//                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
//               </div>

//               {/* Sort Dropdown */}
//               <div className="relative flex-1 md:w-48">
//                 <select
//                   onChange={(e) => {
//                     const [field, order] = e.target.value.split("_");
//                     setSortField(field);
//                     setSortOrder(order);
//                   }}
//                   className="w-full appearance-none bg-black text-white px-4 py-3 pr-10 rounded-full text-xs font-bold uppercase tracking-wider outline-none transition-all hover:bg-gray-800"
//                 >
//                   <option value="_asc text-white">Sort By</option>
//                   <option value="price_asc">Price: Low+</option>
//                   <option value="price_desc">Price: High-</option>
//                   <option value="average_rating_desc">Top Rated</option>
//                 </select>
//                 <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" size={14} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* PRODUCTS GRID */}
//       <section className="max-w-7xl mx-auto px-6 py-12">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
//             <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Loading collection</p>
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[3rem]">
//             <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No results found</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
//             {products.map(product => (
//               <ProductCard 
//                 key={product.id} 
//                 id={product.id}
//                 title={product.name}
//                 imageUrl={product.images?.[0]?.image || "/placeholder.png"}
//                 price={product.price}
//                 salePrice={product.sale_price} // If your API provides it
//                 category={product.category?.name}
//                 averageRating={product.average_rating}
//                  stock={product.stock}
//               />
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import publicApi from "../api/publicApi";

export default function ProductPage() {
  const [products, setProducts] = useState([]); // products array
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // -------------------------
  // FETCH PRODUCTS
  // -------------------------
  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await publicApi.get("products/items/", {
        params: {
          category: selectedCategory || undefined,
          tag: selectedTag || undefined,
          search: search || undefined,
          ordering: sortField ? `${sortOrder === "desc" ? "-" : ""}${sortField}` : undefined,
          page: pageNumber,
        },
      });

      setProducts(res.data.results || []);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);

      // Calculate total pages from count
      const pageSize = res.data.results?.length || 1;
      setTotalPages(Math.ceil(res.data.count / pageSize));
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // FETCH CATEGORIES & TAGS
  // -------------------------
  const fetchCategories = async () => {
    try {
      const res = await publicApi.get("products/categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchTags = async () => {
    try {
      const res = await publicApi.get("products/tags/");
      setTags(res.data);
    } catch (err) {
      console.error("Failed to fetch tags");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [selectedCategory, selectedTag, search, sortField, sortOrder]);

  // -------------------------
  // HANDLE PAGINATION
  // -------------------------
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchProducts(newPage);
  };

  return (
    <div className="bg-white min-h-screen py-6 md:py-10">
      {/* HEADER */}
      <header className=" pb-10 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-6xl font-black text-black tracking-tighter mb-4">SHOP.</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">
            Discover our curated essentials
          </p>
        </div>
      </header>

      {/* SEARCH & FILTERS */}
      <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            <div className="flex w-full md:w-auto gap-2">
              {/* Category */}
              <div className="relative flex-1 md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-full text-xs font-bold uppercase tracking-wider outline-none focus:border-black transition-colors"
                >
                  <option value="">Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
              </div>

              {/* Tag */}
              <div className="relative flex-1 md:w-48">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-full text-xs font-bold uppercase tracking-wider outline-none focus:border-black transition-colors"
                >
                  <option value="">Tags</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
              </div>

              {/* Sort */}
              <div className="relative flex-1 md:w-48">
                <select
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("_");
                    setSortField(field);
                    setSortOrder(order);
                  }}
                  className="w-full appearance-none bg-black text-white px-4 py-3 pr-10 rounded-full text-xs font-bold uppercase tracking-wider outline-none transition-all hover:bg-gray-800"
                >
                  <option value="_asc text-white">Sort By</option>
                  <option value="price_asc">Price: Low+</option>
                  <option value="price_desc">Price: High-</option>
                  <option value="average_rating_desc">Top Rated</option>
                </select>
                <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Loading collection</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[3rem]">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No results found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  title={product.name}
                  imageUrl={product.images?.[0]?.image || "/placeholder.png"}
                  price={product.price}
                  salePrice={product.sale_price}
                  category={product.category?.name}
                  averageRating={product.average_rating}
                  stock={product.stock}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2">
              <button 
                className="px-4 py-2 border rounded-full"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button 
                  key={i} 
                  className={`px-4 py-2 border rounded-full ${page === i+1 ? 'bg-black text-white' : ''}`}
                  onClick={() => handlePageChange(i+1)}
                >
                  {i+1}
                </button>
              ))}
              <button 
                className="px-4 py-2 border rounded-full"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}