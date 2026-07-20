import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const shippingFee = subtotal > 2000 ? 0 : 100;
  const total = subtotal + shippingFee;

  if (authLoading) return <p className="text-center mt-10">Loading...</p>;

  // This directly implements design decision #2
  if (!user) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-gray-800 underline">Browse products</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: address,
      };

      const res = await api.post('/orders', payload);

      clearCart();
      navigate('/order-confirmation', { state: { order: res.data.order } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Shipping Details</h1>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          <input name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          <input name="addressLine1" placeholder="Address Line 1" value={address.addressLine1} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          <input name="addressLine2" placeholder="Address Line 2 (optional)" value={address.addressLine2} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <div className="grid grid-cols-2 gap-3">
            <input name="city" placeholder="City" value={address.city} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            <input name="state" placeholder="State" value={address.state} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <input name="postalCode" placeholder="Postal Code" value={address.postalCode} onChange={handleChange} required className="w-full border rounded px-3 py-2" />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900 disabled:opacity-50 mt-4"
          >
            {submitting ? 'Placing Order...' : `Place Order — ₹${total}`}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span></div>
          <div className="flex justify-between font-bold text-base mt-2"><span>Total</span><span>₹{total}</span></div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;