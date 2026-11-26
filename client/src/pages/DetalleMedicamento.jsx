import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { obtenerMedicamento } from '../services/medicamentos/obtener.js';
import { useAuth } from '../context/AuthContext.jsx';
import FichaMedicamento from '../components/detalle/FichaMedicamento.jsx';
import styles from './DetalleMedicamento.module.css';

export default function DetalleMedicamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();

  const [medicamento, setMedicamento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError('');

    obtenerMedicamento(id)
      .then((datos) => activo && setMedicamento(datos))
      .catch((e) => {
        if (!activo) return;
        // Token vencido o inválido: se cierra la sesión y se manda al login
        if (e.status === 401) {
          cerrarSesion();
          navigate('/login', { replace: true });
          return;
        }
        setError(
          e.status === 404 ? 'El medicamento no existe.' : e.message
        );
      })
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [id]);

  // Ocultar el botón es solo comodidad visual; el backend valida el permiso
  const esAdmin = usuario?.rol === 'administrador';

  return (
    <section className={styles.pagina}>
      <nav className={styles.acciones}>
        <Link to="/" className={styles.volver}>
          ← Volver al catálogo
        </Link>
        {esAdmin && medicamento && (
          <Link to={`/editar/${medicamento.id}`} className={styles.editar}>
            Editar
          </Link>
        )}
      </nav>

      {cargando && <p role="status">Cargando medicamento…</p>}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {medicamento && <FichaMedicamento medicamento={medicamento} />}
    </section>
  );
}