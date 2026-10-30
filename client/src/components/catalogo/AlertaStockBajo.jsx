import styles from './AlertaStockBajo.module.css';

// Muestra un aviso con los medicamentos cuyo stock_actual <= stock_minimo
export default function AlertaStockBajo({ medicamentos }) {
  if (!medicamentos || medicamentos.length === 0) return null;

  return (
    <div className={styles.alerta} role="alert">
      <strong>
        {medicamentos.length === 1
          ? '1 medicamento con stock bajo'
          : `${medicamentos.length} medicamentos con stock bajo`}
      </strong>
      <p className={styles.lista}>
        {medicamentos.map((m) => m.nombre_comercial).join(', ')}
      </p>
    </div>
  );
}