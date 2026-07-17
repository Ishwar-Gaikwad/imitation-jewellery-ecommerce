import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

function AdminCategoryFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      api.get(`/categories/${id}`).then((res) => {
        const c = res.data.category;
        setFormData({ name: c.name, description: c.description || '' });
        setExistingImage(c.image || '');
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = existingImage;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('images', imageFile);

        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.images[0];
      }

      const payload = { ...formData, image: imageUrl };

      if (isEditMode) {
        await api.put(`/categories/${id}`, payload);
      } else {
        await api.post('/categories', payload);
      }

      navigate('/admin/categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Category' : 'Add New Category'}
      </h1>

      {error && (
        <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Category Image</label>
          <input type="file" accept="image/*" onChange={handleImageSelect} />

          {(imagePreview || existingImage) && (
            <img
              src={imagePreview || existingImage}
              alt=""
              className="w-20 h-20 object-cover rounded mt-2"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
        </button>
      </form>
    </div>
  );
}

export default AdminCategoryFormPage;