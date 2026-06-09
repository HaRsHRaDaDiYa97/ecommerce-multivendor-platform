export default function ReviewList({ reviews }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

      {reviews.map((r) => (
        <div key={r.id} className="border-b py-3">
          <div className="font-semibold">{r.user_name}</div>
          <div className="text-yellow-500">⭐ {r.rating}</div>
          <p className="text-gray-600">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
