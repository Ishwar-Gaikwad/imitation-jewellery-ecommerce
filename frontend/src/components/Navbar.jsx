import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          Aabharan
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/products" className="hover:text-gray-600">Shop</Link>

          {user?.role === 'admin' && (
            <Link to="/admin/products" className="hover:text-gray-600">Admin</Link>
          )}

          {user && (
            <Link to="/my-orders" className="hover:text-gray-600">My Orders</Link>
          )}

          <Link to="/cart" className="hover:text-gray-600 relative">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="hover:text-gray-600">{user.name}</Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-800">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-gray-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;