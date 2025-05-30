import { Routes, Route } from 'react-router-dom';
import GuestList from './pages/GuestList';
import TodoList from './pages/TodoList';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProtectedRoute from './components/protectedRoute';


function App() {
  return (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guests" element={<GuestList />} />
      <Route path="/todo-list" element={<TodoList />} />
      {/* other routes */}
    </Routes>
    </>
  );
}


export default App
