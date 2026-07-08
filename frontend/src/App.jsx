import { useAuth } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Signup from './pages/SignupPage';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;