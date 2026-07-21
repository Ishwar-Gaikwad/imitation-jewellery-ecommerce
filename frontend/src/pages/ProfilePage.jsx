import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="border rounded-lg p-6 space-y-3">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Account Type</p>
          <p className="font-medium capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;