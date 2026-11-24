import styles from "./Alert.module.css";

function Alert({ tipo = "info", children }) {
  return (
    <div className={`${styles.alerta} ${styles[tipo]}`} role="alert">
      {children}
    </div>
  );
}

export default Alert;