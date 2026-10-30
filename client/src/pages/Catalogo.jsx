import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerMedicamentos } from '../services/api.js'; // Diego
import TablaMedicamentos from '../components/catalogo/TablaMedicamentos.jsx';
import AlertaStockBajo from '../components/catalogo/AlertaStockBajo.jsx';
import styles from './Catalogo.module.css';

export default function Catalogo() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    let activo = true;
    obtenerMedicamentos()
      .then((datos) => activo && setMedicamentos(datos))
      .catch((e) => activo && setError(e.message || 'No se pudo cargar el catálogo'))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  // Filtro por nombre comercial o sustancia activa
  const filtrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    if (!t) return medicamentos;
    return medicamentos.filter(
      (m) =>
        m.nombre_comercial.toLowerCase().includes(t) ||
        m.sustancia_activa.toLowerCase().includes(t)
    );
  }, [medicamentos, busqueda]);

  // Regla de negocio: stock bajo cuando stock_actual <= stock_minimo
  const stockBajo = medicamentos.filter((m) => m.stock_actual <= m.stock_minimo);

  return (
    <section className={styles.pagina}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Catálogo de medicamentos</h1>
        <Link to="/alta" className={styles.botonNuevo}>
          Agregar medicamento
        </Link>
      </header>

      {!cargando && !error && <AlertaStockBajo medicamentos={stockBajo} />}

      <div className={styles.buscador}>
        <label htmlFor="buscar" className={styles.etiqueta}>
          Buscar por nombre o sustancia activa
        </label>
        <input
          id="buscar"
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Ej. Paracetamol"
          className={styles.input}
        />
      </div>

      {cargando && <p role="status">Cargando medicamentos…</p>}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {!cargando && !error && filtrados.length === 0 && (
        <p className={styles.vacio}>
          {medicamentos.length === 0
            ? 'Aún no hay medicamentos registrados. Agrega el primero.'
            : 'Ningún medicamento coincide con la búsqueda.'}
        </p>
      )}
      {!cargando && !error && filtrados.length > 0 && (
        <TablaMedicamentos medicamentos={filtrados} />
      )}
    </section>
  );
}