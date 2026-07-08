import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ 
        email: '', 
        password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome Back</h1>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-gray-800 font-medium underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;