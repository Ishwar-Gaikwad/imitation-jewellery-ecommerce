import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setAdded(false);
    setSelectedImage(0);
    setQuantity(1);

    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 grid md:grid-cols-2 gap-8">
      <div>
        <img
          src={product.images[selectedImage]}
          alt={product.name}
          className="w-full aspect-square object-cover rounded-lg"
        />
        {product.images.length > 1 && (
          <div className="flex gap-2 mt-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                  i === selectedImage ? 'border-gray-800' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <Link to={`/products?category=${product.category._id}`} className="text-sm text-gray-500 hover:underline">
          {product.category.name}
        </Link>
        <h1 className="text-2xl font-bold mt-1">{product.name}</h1>

        <div className="mt-3">
          {product.discountPrice ? (
            <p className="text-xl">
              <span className="font-bold">₹{product.discountPrice}</span>{' '}
              <span className="text-gray-400 line-through">₹{product.price}</span>
            </p>
          ) : (
            <p className="text-xl font-bold">₹{product.price}</p>
          )}
        </div>

        <p className="text-gray-600 mt-4">{product.description}</p>

        {product.material && (
          <p className="text-sm text-gray-500 mt-2">Material: {product.material}</p>
        )}

        <p className={`text-sm mt-3 ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
          {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
        </p>

        {product.stock > 0 && (
          <>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 border rounded"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-8 h-8 border rounded"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-4 w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900"
            >
              {added ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;