import { useAuth } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Signup from './pages/SignupPage';
import AdminRoute from './components/AdminRoute';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminCategoryFormPage from './pages/admin/AdminCategoryFormPage';
import CartPage from './pages/CartPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';

function HomePlaceholder() {
  const { user, loading, logout } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="text-center mt-10">
      {user ? (
        <>
          <h1 className="text-2xl">Welcome, {user.name}!</h1>
          <button onClick={logout} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded">
            Logout
          </button>
        </>
      ) : (
        <h1 className="text-2xl">Home Page (not logged in)</h1>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path='/' element={<HomePlaceholder />}/>

        <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProductsPage />
              </AdminRoute>
            }
        />

        <Route path="/admin/products/new" element={
              <AdminRoute>
                <AdminProductFormPage />
              </AdminRoute>
            }
         />

        <Route path="/admin/products/:id/edit" element={
              <AdminRoute>
                <AdminProductFormPage />
              </AdminRoute>
            }
         />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminCategoriesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories/new"
          element={
            <AdminRoute>
              <AdminCategoryFormPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories/:id/edit"
          element={
            <AdminRoute>
              <AdminCategoryFormPage />
            </AdminRoute>
          }
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />    


      </Routes>
    </BrowserRouter>
  );
}

export default App;