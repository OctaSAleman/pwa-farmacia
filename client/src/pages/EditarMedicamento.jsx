import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MedicamentoForm from '../components/formulario/MedicamentoForm.jsx';
import ConfirmDialog from '../components/acciones/ConfirmDialog.jsx'; // Edwin
import {
  obtenerMedicamento,
  actualizarMedicamento,
  eliminarMedicamento,
} from '../services/api.js';
import estilos from './EditarMedicamento.module.css';

function EditarMedicamento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicamento, setMedicamento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorApi, setErrorApi] = useState('');
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // Cargar los datos actuales del medicamento
  useEffect(() => {
    let activo = true;
    obtenerMedicamento(id)
      .then((datos) => activo && setMedicamento(datos))
      .catch((e) =>
        activo && setErrorCarga(e.status === 404 ? 'El medicamento no existe.' : e.message)
      )
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [id]);

  async function guardar(cambios) {
    setEnviando(true);
    setErrorApi('');
    try {
      await actualizarMedicamento(id, cambios); // PUT /api/medicamentos/:id
      navigate('/'); // vuelve al catálogo
    } catch (err) {
      setErrorApi(err.message || 'No se pudo guardar el medicamento');
    } finally {
      setEnviando(false);
    }
  }

  async function eliminar() {
    setEliminando(true);
    setErrorApi('');
    try {
      await eliminarMedicamento(id); // DELETE /api/medicamentos/:id
      navigate('/');
    } catch (err) {
      setErrorApi(err.message || 'No se pudo eliminar el medicamento');
      setConfirmando(false);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <section className={estilos.pagina}>
      <Link to="/" className={estilos.volver}>
        ← Volver al catálogo
      </Link>

      <div className={estilos.encabezado}>
        <h1 className={estilos.titulo}>Editar medicamento</h1>
        {medicamento && (
          <button type="button" className={estilos.botonEliminar} onClick={() => setConfirmando(true)}>
            Eliminar
          </button>
        )}
      </div>

      {cargando && <p role="status">Cargando medicamento…</p>}
      {errorCarga && (
        <p className={estilos.errorApi} role="alert">
          {errorCarga}
        </p>
      )}

      {errorApi && (
        <p className={estilos.errorApi} role="alert">
          {errorApi}
        </p>
      )}

      {medicamento && (
        <>
          <p className={estilos.ayuda}>Los campos marcados con * son obligatorios.</p>
          <MedicamentoForm
            valoresIniciales={medicamento}
            onSubmit={guardar}
            textoBoton="Guardar cambios"
            enviando={enviando}
          />
        </>
      )}

      <ConfirmDialog
        abierto={confirmando}
        titulo="Eliminar medicamento"
        mensaje={`¿Seguro que quieres eliminar "${medicamento?.nombre_comercial ?? ''}"? Ya no aparecerá en el catálogo.`}
        textoConfirmar="Sí, eliminar"
        procesando={eliminando}
        onConfirmar={eliminar}
        onCancelar={() => setConfirmando(false)}
      />
    </section>
  );
}

export default EditarMedicamento;
