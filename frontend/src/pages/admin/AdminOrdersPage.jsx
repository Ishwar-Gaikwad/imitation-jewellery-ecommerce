import { useState, useEffect } from 'react';
import api from '../../api/axios';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError('');

    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      {error && (
        <p className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</p>
      )}

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-sm text-gray-600">
              <th className="py-2">Order</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Date</th>
              <th className="py-2">Items</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-3 text-sm font-mono">
                  {order._id.slice(-8).toUpperCase()}
                </td>
                <td className="py-3">
                  <p className="text-sm font-medium">{order.user?.name || 'Deleted user'}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="py-3 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="py-3 text-sm">{order.items.length}</td>
                <td className="py-3 font-medium">₹{order.totalAmount}</td>
                <td className="py-3">
                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-0 ${statusStyles[order.status]} disabled:opacity-50`}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrdersPage;