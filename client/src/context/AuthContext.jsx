import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Lee el contenido (payload) del JWT para saber cuándo vence
function tokenVigente(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Recupera la sesión guardada, si existe y no ha vencido
function leerSesion() {
  try {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (token && usuario && tokenVigente(token)) return { token, usuario };
  } catch {
    // si el almacenamiento falla, se trata como sin sesión
  }
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  return { token: null, usuario: null };
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  // Se llama desde Login.jsx con la respuesta de POST /api/auth/login
  function iniciarSesion(token, usuario) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setSesion({ token, usuario });
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setSesion({ token: null, usuario: null });
  }

  const valor = {
    token: sesion.token,
    usuario: sesion.usuario, // { nombre, rol }
    estaAutenticado: Boolean(sesion.token),
    iniciarSesion,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// Hook para usar la sesión en cualquier componente
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}