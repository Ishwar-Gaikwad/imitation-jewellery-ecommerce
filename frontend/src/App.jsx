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
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<Signup/>}/>

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
        <Route path="/admin/orders" element={
                  <AdminRoute>
                    <AdminOrdersPage />
                  </AdminRoute>
                }/>

        
      </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;