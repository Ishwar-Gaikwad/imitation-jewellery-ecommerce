import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Signup from './pages/SignupPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path='/' element={<h1 className='text-center mt-10'>Home Page (coming soon)</h1>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;