import { Routes, Route } from 'react-router-dom';
import GuestList from './pages/GuestList';
import TodoList from './pages/TodoList';
import SeatingPlanner from './pages/SeatingPlanner';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BudgetTracker from './pages/BudgetTracker';
import Deneme from './pages/deneme';
import ProtectedRoute from './components/protectedRoute';


function App() {
  return (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guests" element={<GuestList />} />
      <Route path="/todo-list" element={<TodoList />} />
      <Route path="/seating-setup" element={<SeatingPlanner />} />
      <Route path='/budget-tracker' element={<BudgetTracker />} />
      <Route path='/deneme' element={<Deneme />} />
      {/* other routes */}
    </Routes>
    </>
  );
}


export default App
