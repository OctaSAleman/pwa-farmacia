import styles from "./Button.module.css";

// Boton reutilizable. variante: "primario" | "secundario" | "peligro"
function Button({ children, variante = "primario", type = "button", ...props }) {
  return (
    <button type={type} className={`${styles.boton} ${styles[variante]}`} {...props}>
      {children}
    </button>
  );
}

export default Button;