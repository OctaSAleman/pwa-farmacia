import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Navbar.module.css";

function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const esAdmin = usuario?.rol === "administrador";

  function salir() {
    cerrarSesion();
    navigate("/login", { replace: true });
  }

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.marca}>
        <span>Farmacia</span>
      </NavLink>
      <div className={styles.enlaces}>
        <NavLink to="/" end className={styles.enlace}>Catálogo</NavLink>
        {esAdmin && <NavLink to="/alta" className={styles.enlace}>Nuevo</NavLink>}
        {usuario && (
          <span className={styles.usuario} title={usuario.rol}>
            {usuario.nombre}
          </span>
        )}
        <button type="button" className={styles.salir} onClick={salir}>
          Salir
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
