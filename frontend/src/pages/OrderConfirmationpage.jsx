import { useLocation, Link, Navigate } from 'react-router-dom';

function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-lg mx-auto mt-16 text-center px-4">
      <h1 className="text-2xl font-bold text-green-700">Order Placed! 🎉</h1>
      <p className="text-gray-600 mt-2">Order ID: {order._id}</p>
      <p className="text-gray-600">Total: ₹{order.totalAmount}</p>
      <p className="text-gray-500 text-sm mt-1">Status: {order.status}</p>

      <Link to="/products" className="inline-block mt-6 bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900">
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderConfirmationPage;