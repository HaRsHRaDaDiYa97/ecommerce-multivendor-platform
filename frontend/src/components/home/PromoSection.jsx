export default function PromoSection() {
  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        <h2 className="text-white text-3xl md:text-5xl font-black tracking-tight text-center md:text-left">
          QUALITY OVER <br /> QUANTITY.
        </h2>

        <div className="text-center md:text-right">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-6 max-w-xs md:ml-auto">
            Every item is hand-picked to ensure excellence.
          </p>

          <button className="text-white text-xs font-bold uppercase tracking-[0.3em] border-b border-white pb-2 hover:text-gray-400 hover:border-gray-400 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
