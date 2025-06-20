import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';

const App: React.FC = () => (
  <Router>
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
      <Link to="/register">Sign Up</Link>
    </nav>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<div style={{ padding: '2rem' }}><h1>Okta-like Platform</h1><p>Welcome!</p></div>} />
    </Routes>
  </Router>
);
export default App;
