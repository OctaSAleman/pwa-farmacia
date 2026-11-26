import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

// Uso: <ProtectedRoute roles={['administrador']}>...</ProtectedRoute>
// Sin "roles", basta con tener sesión (básico o administrador).
// Ojo: esto solo mejora la experiencia; el permiso real lo valida el backend.
export default function ProtectedRoute({ roles, children }) {
  const { estaAutenticado, usuario } = useAuth();
  const ubicacion = useLocation();

  // Sin sesión: al login, recordando a dónde quería ir
  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ desde: ubicacion }} />;
  }

  // Con sesión pero sin el rol necesario: de vuelta al catálogo
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}