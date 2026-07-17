import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setError('');

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading categories...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <Link
          to="/admin/categories/new"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          + Add Category
        </Link>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</p>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left text-sm text-gray-600">
            <th className="py-2">Name</th>
            <th className="py-2">Slug</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} className="border-b">
              <td className="py-2">{cat.name}</td>
              <td className="py-2 text-gray-500">{cat.slug}</td>
              <td className="py-2 space-x-3">
                <Link
                  to={`/admin/categories/${cat._id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategoriesPage;