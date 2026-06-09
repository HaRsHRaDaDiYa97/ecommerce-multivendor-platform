export default function StoreHeader({ store, onFollow }) {
  return (
    <div className="bg-white shadow rounded-xl overflow-hidden mb-6">
      <img
        src={store.banner}
        alt="banner"
        className="w-full h-56 object-cover"
      />

      <div className="p-6 flex gap-6 items-center">
        <img
          src={store.logo}
          alt="logo"
          className="w-28 h-28 rounded-full border object-cover"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{store.name}</h1>
          <p className="text-gray-500">{store.tagline}</p>

          <div className="mt-2 text-yellow-500 font-semibold">
            ⭐ {store.rating} ({store.total_reviews} reviews)
          </div>

          <button
            onClick={onFollow}
            className="mt-3 px-4 py-2 bg-black text-white rounded-lg"
          >
            Follow Store
          </button>
        </div>
      </div>
    </div>
  );
}
