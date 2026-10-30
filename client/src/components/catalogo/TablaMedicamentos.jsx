import { Link } from 'react-router-dom';
import styles from './TablaMedicamentos.module.css';

const formatoPrecio = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

// La fecha viene como AAAA-MM-DD; se formatea sin desfase de zona horaria
function formatoFecha(valor) {
  if (!valor) return '';
  const [anio, mes, dia] = String(valor).slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

// Regla de negocio: stock bajo cuando stock_actual <= stock_minimo
const esStockBajo = (m) => m.stock_actual <= m.stock_minimo;

export default function TablaMedicamentos({ medicamentos }) {
  return (
    <div className={styles.contenedor}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre comercial</th>
            <th>Sustancia activa</th>
            <th>Presentación</th>
            <th>Concentración</th>
            <th>Lote</th>
            <th>Caducidad</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicamentos.map((m) => {
            const bajo = esStockBajo(m);
            return (
              <tr key={m.id} className={bajo ? styles.filaBaja : ''}>
                <td data-label="Imagen">
                  {m.imagen_url ? (
                    <img
                      src={m.imagen_url}
                      alt={`Imagen de ${m.nombre_comercial}`}
                      className={styles.imagen}
                      loading="lazy"
                    />
                  ) : (
                    <span className={styles.sinImagen}>Sin imagen</span>
                  )}
                </td>
                <td data-label="Nombre comercial">{m.nombre_comercial}</td>
                <td data-label="Sustancia activa">{m.sustancia_activa}</td>
                <td data-label="Presentación">{m.presentacion}</td>
                <td data-label="Concentración">{m.concentracion}</td>
                <td data-label="Lote">{m.lote}</td>
                <td data-label="Caducidad">{formatoFecha(m.fecha_caducidad)}</td>
                <td data-label="Precio">{formatoPrecio.format(m.precio_publico)}</td>
                <td data-label="Stock">
                  {m.stock_actual} / mín. {m.stock_minimo}
                  {bajo && <span className={styles.etiquetaBaja}>Stock bajo</span>}
                </td>
                <td data-label="Acciones">
                  <Link to={`/editar/${m.id}`} className={styles.enlace}>
                    Editar
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}