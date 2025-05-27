import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guests" element={<GuestList />} />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}


export default App
