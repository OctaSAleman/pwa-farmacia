import styles from './FichaMedicamento.module.css';

const formatoPrecio = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

// La fecha viene como AAAA-MM-DD
function formatoFecha(valor) {
  if (!valor) return '';
  const [anio, mes, dia] = String(valor).slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

export default function FichaMedicamento({ medicamento }) {
  // Regla de negocio: stock bajo cuando stock_actual <= stock_minimo
  const stockBajo = medicamento.stock_actual <= medicamento.stock_minimo;

  const datos = [
    ['Sustancia activa', medicamento.sustancia_activa],
    ['Presentación', medicamento.presentacion],
    ['Concentración', medicamento.concentracion],
    ['Lote', medicamento.lote],
    ['Fecha de caducidad', formatoFecha(medicamento.fecha_caducidad)],
    ['Precio público', formatoPrecio.format(medicamento.precio_publico)],
    ['Stock actual', medicamento.stock_actual],
    ['Stock mínimo', medicamento.stock_minimo],
  ];

  return (
    <article className={styles.ficha}>
      <div className={styles.imagenCaja}>
        {medicamento.imagen_url ? (
          <img
            src={medicamento.imagen_url}
            alt={`Imagen de ${medicamento.nombre_comercial}`}
            className={styles.imagen}
          />
        ) : (
          <span className={styles.sinImagen}>Sin imagen</span>
        )}
      </div>

      <div className={styles.contenido}>
        <h2 className={styles.nombre}>{medicamento.nombre_comercial}</h2>

        {stockBajo && (
          <p className={styles.alerta} role="alert">
            Stock bajo: quedan {medicamento.stock_actual} unidades y el mínimo es{' '}
            {medicamento.stock_minimo}.
          </p>
        )}

        <dl className={styles.lista}>
          {datos.map(([etiqueta, valor]) => (
            <div key={etiqueta} className={styles.fila}>
              <dt>{etiqueta}</dt>
              <dd>{valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}