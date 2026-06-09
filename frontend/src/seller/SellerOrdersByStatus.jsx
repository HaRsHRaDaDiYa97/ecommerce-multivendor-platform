import { useEffect, useState } from "react";
import { getSellerOrdersByStatus } from "../api/sellerApi";

export default function SellerOrdersByStatus({ status }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getSellerOrdersByStatus(status);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (orders.length === 0) return <p>No orders with status "{status}"</p>;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Orders - {status}</h2>
      {orders.map((order) => (
        <div key={order.item_id} className="p-2 border mb-2 rounded">
          <p>{order.product} - {order.status}</p>
          <p>Customer: {order.customer}</p>
          <p>Price: ${order.price}</p>
        </div>
      ))}
    </div>
  );
}
