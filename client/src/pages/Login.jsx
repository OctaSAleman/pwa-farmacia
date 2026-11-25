import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { login } from '../services/auth.js'; // Diego
import styles from './Login.module.css'; // Alan

export default function Login() {
  const { estaAutenticado, iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const ubicacion = useLocation();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // A dónde volver después de entrar (ruta protegida que se intentó abrir)
  const destino = ubicacion.state?.desde?.pathname || '/';

  // Si ya hay sesión, no tiene sentido mostrar el login
  if (estaAutenticado) {
    return <Navigate to="/" replace />;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');

    // Validación en el frontend (el backend valida igual)
    if (!correo.trim() || !password) {
      setError('Escribe tu correo y tu contraseña.');
      return;
    }

    setEnviando(true);
    try {
      const { token, usuario } = await login(correo.trim(), password);
      iniciarSesion(token, usuario);
      navigate(destino, { replace: true });
    } catch (e) {
      // Mensaje genérico, sin revelar si falló el correo o la contraseña
      setError(
        e.status === 401
          ? 'Credenciales incorrectas'
          : e.message || 'No se pudo iniciar sesión. Intenta de nuevo.'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className={styles.contenedor}>
      <form className={styles.tarjeta} onSubmit={manejarEnvio} noValidate>
        <h1 className={styles.titulo}>Iniciar sesión</h1>

        <div className={styles.campo}>
          <label htmlFor="correo" className={styles.etiqueta}>
            Correo electrónico
          </label>
          <input
            id="correo"
            type="email"
            autoComplete="username"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="password" className={styles.etiqueta}>
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}

        <button type="submit" className={styles.boton} disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </section>
  );
}