import { useEffect } from 'react';
import estilos from './ConfirmDialog.module.css';

// Cuadro de confirmación reutilizable (se usa para eliminar)
function ConfirmDialog({
  abierto,
  titulo = 'Confirmar acción',
  mensaje,
  textoConfirmar = 'Eliminar',
  textoCancelar = 'Cancelar',
  procesando = false,
  onConfirmar,
  onCancelar,
}) {
  // Cierra con la tecla Escape
  useEffect(() => {
    if (!abierto) return;
    function alPresionar(e) {
      if (e.key === 'Escape' && !procesando) onCancelar();
    }
    document.addEventListener('keydown', alPresionar);
    return () => document.removeEventListener('keydown', alPresionar);
  }, [abierto, procesando, onCancelar]);

  if (!abierto) return null;

  return (
    <div className={estilos.fondo} onClick={() => !procesando && onCancelar()}>
      <div
        className={estilos.dialogo}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-titulo"
        aria-describedby="confirm-mensaje"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-titulo" className={estilos.titulo}>
          {titulo}
        </h2>
        <p id="confirm-mensaje" className={estilos.mensaje}>
          {mensaje}
        </p>
        <div className={estilos.acciones}>
          <button type="button" className={estilos.cancelar} onClick={onCancelar} disabled={procesando}>
            {textoCancelar}
          </button>
          <button type="button" className={estilos.confirmar} onClick={onConfirmar} disabled={procesando}>
            {procesando ? 'Procesando...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;