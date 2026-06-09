import { useEffect, useState } from "react";
import { fetchFollowingStores } from "../../features/store/storeApi.js";
import { Link } from "react-router-dom";
import { Store as StoreIcon, ChevronRight, Star, ShieldCheck } from "lucide-react";

export default function FollowingStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStores = async () => {
      try {
        const data = await fetchFollowingStores();
        setStores(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4 bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Loading your favorites</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        
        {/* Page Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black border border-gray-100 shadow-sm">
              <StoreIcon size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-black leading-none">Followed Stores</h1>
              <p className="text-sm text-gray-500 mt-1">Keep track of your favorite merchants and their latest collections.</p>
            </div>
          </div>
        </header>

        {stores.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200 text-center px-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6">
              <StoreIcon size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No followed stores yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">
              When you follow a store, it will appear here so you can easily access their products and updates.
            </p>
            <Link 
              to="/products" 
              className="px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/10 hover:bg-gray-900 transition-all active:scale-95"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          /* Store Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Link
                key={store.id}
                to={`/store/${store.slug}`}
                className="group relative block p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-black/10 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 overflow-hidden"
              >
                {/* Decorative background shape */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-gray-100 transition-colors duration-500 -z-0"></div>

                <div className="relative z-10 flex items-center gap-5">
                  
                  {/* Store Logo */}
                  <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {store.logo ? (
                      <img
                        src={
                          store.logo.startsWith("http")
                            ? store.logo
                            : `http://127.0.0.1:8000${store.logo}`
                        }
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <StoreIcon size={24} className="text-gray-300" />
                    )}
                  </div>

                  {/* Store Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h2 className="font-medium text-black truncate text-lg group-hover:text-blue-600 transition-colors">
                        {store.name}
                      </h2>
                      <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-bold text-gray-600 mt-0.5">5.0</span>
                      </div>
                      <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                        {store.total_reviews || 0} Reviews
                      </p>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors duration-300 border border-gray-100 group-hover:border-black">
                    <ChevronRight size={18} />
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}