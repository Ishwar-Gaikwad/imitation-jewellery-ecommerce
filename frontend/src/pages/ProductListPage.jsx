import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || '';

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSort) params.set('sort', selectedSort);

    api
      .get(`/products?${params.toString()}`)
      .then((res) => setProducts(res.data.products))
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedSort]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('category', value);
      else next.delete('category');
      return next;
    });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('sort', value);
      else next.delete('sort');
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Shop All Products</h1>

      <div className="flex gap-4 mb-6">
        <select value={selectedCategory} onChange={handleCategoryChange} className="border rounded px-3 py-2">
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <select value={selectedSort} onChange={handleSortChange} className="border rounded px-3 py-2">
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading && <p className="text-center text-gray-500 mt-10">Loading products...</p>}
      {error && <p className="text-center text-red-600 mt-10">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="border rounded-lg overflow-hidden hover:shadow-md transition"
          >
            <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-3">
              <p className="font-medium truncate">{product.name}</p>
              {product.discountPrice ? (
                <p>
                  <span className="font-semibold">₹{product.discountPrice}</span>{' '}
                  <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
                </p>
              ) : (
                <p className="font-semibold">₹{product.price}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;