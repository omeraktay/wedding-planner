import { Routes, Route } from 'react-router-dom';
import GuestList from './pages/GuestList';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProtectedRoute from './components/protectedRoute';


function App() {
  return (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guests" element={<ProtectedRoute><GuestList /></ProtectedRoute>} />
      {/* other routes */}
    </Routes>
    </>
  );
}


export default App
