import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, rol }) {
  const token = localStorage.getItem('token');
  const userRol = localStorage.getItem('rol');

  if (!token || userRol !== rol) {
    return <Navigate to="/login" />;
  }

  return children;
}
