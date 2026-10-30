import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicamentoForm from '../components/formulario/MedicamentoForm.jsx';
import { crearMedicamento } from '../services/api.js'; // Diego
import estilos from './AltaMedicamento.module.css';

function AltaMedicamento() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [errorApi, setErrorApi] = useState('');

  async function guardar(medicamento) {
    setEnviando(true);
    setErrorApi('');
    try {
      await crearMedicamento(medicamento); // POST /api/medicamentos
      navigate('/'); // vuelve al catálogo
    } catch (err) {
      setErrorApi(err.message || 'No se pudo guardar el medicamento');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className={estilos.pagina}>
      <h1 className={estilos.titulo}>Alta de medicamento</h1>
      <p className={estilos.ayuda}>Los campos marcados con * son obligatorios.</p>

      {errorApi && (
        <p className={estilos.errorApi} role="alert">
          {errorApi}
        </p>
      )}

      <MedicamentoForm onSubmit={guardar} textoBoton="Guardar medicamento" enviando={enviando} />
    </main>
  );
}

export default AltaMedicamento;