import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-gray-800 underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({itemCount} items)</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 border-b pb-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500 text-sm">₹{item.price} each</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-7 h-7 border rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => {
                  if (item.quantity < item.stock) {
                    updateQuantity(item.productId, item.quantity + 1);
                  }
                }}
                className="w-7 h-7 border rounded"
              >
                +
              </button>
            </div>

            <p className="w-20 text-right font-medium">₹{item.price * item.quantity}</p>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-600 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center text-lg font-bold">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      <Link
        to="/checkout"
        className="block text-center mt-6 bg-gray-800 text-white py-3 rounded hover:bg-gray-900"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default CartPage;