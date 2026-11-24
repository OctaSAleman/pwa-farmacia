import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.marca}>
        {}
        <span>Farmacia</span>
      </NavLink>
      <div className={styles.enlaces}>
        <NavLink to="/" className={styles.enlace}>Catálogo</NavLink>
        <NavLink to="/alta" className={styles.enlace}>Nuevo</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;