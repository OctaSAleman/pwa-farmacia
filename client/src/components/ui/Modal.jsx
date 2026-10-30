import styles from "./Modal.module.css";

// Ventana modal. Se muestra solo si abierto = true
function Modal({ abierto, titulo, onCerrar, children }) {
  if (!abierto) return null;

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.encabezado}>
          <h2>{titulo}</h2>
          <button className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">
            ×
          </button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;