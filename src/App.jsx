import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MeseroDashboard from './pages/MeseroDashboard';
import CocinaDashboard from './pages/CocinaDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute rol="administrador"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/mesero" element={<ProtectedRoute rol="mesero"><MeseroDashboard /></ProtectedRoute>} />
        <Route path="/cocina" element={<ProtectedRoute rol="cocina"><CocinaDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
