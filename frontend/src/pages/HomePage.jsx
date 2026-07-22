import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products?limit=4').then((res) => setFeatured(res.data.products));
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  return (
    <div>
      <section className="bg-gray-100 py-20 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold">Timeless Imitation Jewellery</h1>
        <p className="text-gray-600 mt-3 max-w-md mx-auto">
          Elegant pieces for every occasion, crafted to last.
        </p>
        <Link
          to="/products"
          className="inline-block mt-6 bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900"
        >
          Shop Now
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition text-center"
            >
              {cat.image && (
                <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover" />
              )}
              <p className="py-2 font-medium">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="font-medium truncate">{product.name}</p>
                <p className="font-semibold">₹{product.discountPrice || product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;