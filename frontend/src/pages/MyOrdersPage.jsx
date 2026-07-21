import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!user) return;

    api
      .get('/orders/my-orders')
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <p className="text-center mt-10">Loading your orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
        <Link to="/products" className="text-gray-800 underline">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
            >
              <div>
                <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                  {' · '}
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[order.status]}`}>
                  {order.status}
                </span>
                <span className="font-semibold">₹{order.totalAmount}</span>
              </div>
            </div>

            {expandedId === order._id && (
              <div className="mt-4 pt-4 border-t space-y-3">
                {order.items.map((item) => (
                  <div key={item.product} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1 text-sm">
                      <p>{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}

                <div className="text-sm text-gray-600 pt-2">
                  <p className="font-medium text-gray-800 mb-1">Shipping to:</p>
                  <p>{order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrdersPage;