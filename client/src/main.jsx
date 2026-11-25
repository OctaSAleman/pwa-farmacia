import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Sesión de usuario (Gerardo)
import { AuthProvider } from './context/AuthContext.jsx';

// Estilos globales de Alan (UX)
import './styles/variables.css';
import './styles/global.css';
import './styles/responsive.css';

// Registro del Service Worker (Diego)
import './registerSW.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);


