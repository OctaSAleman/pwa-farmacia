import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout (Alan)
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

// Protección de rutas (Gerardo)
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Pantallas
import Login from './pages/Login.jsx'; // Gerardo
import Catalogo from './pages/Catalogo.jsx'; // Alan
import DetalleMedicamento from './pages/DetalleMedicamento.jsx'; // Gerardo
import AltaMedicamento from './pages/AltaMedicamento.jsx'; // Diego
import EditarMedicamento from './pages/EditarMedicamento.jsx'; // Octavio

export default function App() {
  const { pathname } = useLocation();
  const esLogin = pathname === '/login';

  return (
    <>
      {/* En el login no se muestran la barra ni el pie */}
      {!esLogin && <Navbar />}
      <main id="contenido">
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<Login />} />

          {/* Cualquier usuario con sesión (básico o administrador) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Catalogo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicamentos/:id"
            element={
              <ProtectedRoute>
                <DetalleMedicamento />
              </ProtectedRoute>
            }
          />

          {/* Solo administrador */}
          <Route
            path="/alta"
            element={
              <ProtectedRoute roles={['administrador']}>
                <AltaMedicamento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar/:id"
            element={
              <ProtectedRoute roles={['administrador']}>
                <EditarMedicamento />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!esLogin && <Footer />}
    </>
  );
}