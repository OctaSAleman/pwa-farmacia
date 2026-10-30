import { Routes, Route, Navigate } from 'react-router-dom';

// Componentes de layout (Alan)
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

// Pantallas
import Catalogo from './pages/Catalogo.jsx'; // Ramón
import AltaMedicamento from './pages/AltaMedicamento.jsx'; // Edwin
import EditarMedicamento from './pages/EditarMedicamento.jsx'; // Octavio

export default function App() {
  return (
    <>
      <Navbar />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/alta" element={<AltaMedicamento />} />
          <Route path="/editar/:id" element={<EditarMedicamento />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}