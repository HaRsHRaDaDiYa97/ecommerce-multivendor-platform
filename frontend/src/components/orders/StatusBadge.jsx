export default function StatusBadge({ status }) {
  if (!status) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300">
        ACTIVE
      </span>
    );
  }

  const styles = {
    PLACED:
      "bg-green-100 text-green-700 border-green-300",

    CONFIRMED:
      "bg-blue-100 text-blue-700 border-blue-300",

    PACKED:
      "bg-orange-100 text-orange-700 border-orange-300",

    SHIPPED:
      "bg-indigo-100 text-indigo-700 border-indigo-300",

    OUT_FOR_DELIVERY:
      "bg-purple-100 text-purple-700 border-purple-300",

    DELIVERED:
      "bg-emerald-500 text-white border-emerald-600 shadow-md",

    CANCELLED:
      "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border transition-all duration-300
      ${styles[status] || "bg-blue-100 text-blue-700 border-blue-300"}`}
    >
      <span className="w-2 h-2 rounded-full bg-current"></span>
      {status.replaceAll("_", " ")}
    </span>
  );
}
