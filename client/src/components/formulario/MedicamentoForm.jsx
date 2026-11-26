import { useState } from 'react';
import { validarMedicamento } from '../../utils/validaciones.js'; // Diego
import estilos from './MedicamentoForm.module.css';

// Valores permitidos según el contrato de la API (sección 9)
export const PRESENTACIONES = ['Tabletas', 'Jarabe', 'Ampolletas', 'Cápsulas', 'Pomada'];

const VACIO = {
  nombre_comercial: '',
  sustancia_activa: '',
  presentacion: '',
  concentracion: '',
  lote: '',
  fecha_caducidad: '',
  precio_publico: '',
  stock_actual: '',
  stock_minimo: '',
  imagen_url: '',
};

// Prepara los valores iniciales (útil también para la pantalla de edición)
function prepararIniciales(valores) {
  const base = { ...VACIO, ...valores };
  return {
    ...base,
    // MySQL puede devolver la fecha como ISO; el input date necesita AAAA-MM-DD
    fecha_caducidad: base.fecha_caducidad ? String(base.fecha_caducidad).slice(0, 10) : '',
    imagen_url: base.imagen_url ?? '',
  };
}

// Campo reutilizable: etiqueta + control + mensaje de error
function Campo({ id, etiqueta, obligatorio = true, error, children }) {
  return (
    <div className={estilos.campo}>
      <label htmlFor={id} className={estilos.etiqueta}>
        {etiqueta}
        {obligatorio && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={estilos.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function MedicamentoForm({ valoresIniciales = {}, onSubmit, textoBoton = 'Guardar', enviando = false }) {
  const [datos, setDatos] = useState(() => prepararIniciales(valoresIniciales));
  const [errores, setErrores] = useState({});

  function manejarCambio(e) {
    const { name, value } = e.target;
    setDatos((previo) => ({ ...previo, [name]: value }));
  }

  function manejarEnvio(e) {
    e.preventDefault();

    // Validación en frontend (misma lógica que el backend)
    const erroresEncontrados = validarMedicamento(datos);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) return;

    // Se arma el objeto con los nombres exactos del contrato
    const medicamento = {
      nombre_comercial: datos.nombre_comercial.trim(),
      sustancia_activa: datos.sustancia_activa.trim(),
      presentacion: datos.presentacion,
      concentracion: datos.concentracion.trim(),
      lote: datos.lote.trim(),
      fecha_caducidad: datos.fecha_caducidad,
      precio_publico: Number(datos.precio_publico),
      stock_actual: Number(datos.stock_actual),
      stock_minimo: Number(datos.stock_minimo),
      imagen_url: datos.imagen_url.trim() || null, // opcional
    };

    onSubmit(medicamento);
  }

  // Atributos comunes de accesibilidad para cada control
  const propsCampo = (nombre) => ({
    id: nombre,
    name: nombre,
    value: datos[nombre],
    onChange: manejarCambio,
    'aria-invalid': errores[nombre] ? 'true' : 'false',
    'aria-describedby': errores[nombre] ? `${nombre}-error` : undefined,
    className: `${estilos.control} ${errores[nombre] ? estilos.controlError : ''}`,
  });

  return (
    <form className={estilos.formulario} onSubmit={manejarEnvio} noValidate>
      <Campo id="nombre_comercial" etiqueta="Nombre comercial" error={errores.nombre_comercial}>
        <input type="text" maxLength={100} {...propsCampo('nombre_comercial')} />
      </Campo>

      <Campo id="sustancia_activa" etiqueta="Sustancia activa" error={errores.sustancia_activa}>
        <input type="text" maxLength={100} {...propsCampo('sustancia_activa')} />
      </Campo>

      <Campo id="presentacion" etiqueta="Presentación" error={errores.presentacion}>
        <select {...propsCampo('presentacion')}>
          <option value="">Selecciona una opción</option>
          {PRESENTACIONES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Campo>

      <Campo id="concentracion" etiqueta="Concentración (ej. 500 mg)" error={errores.concentracion}>
        <input type="text" maxLength={50} {...propsCampo('concentracion')} />
      </Campo>

      <Campo id="lote" etiqueta="Lote" error={errores.lote}>
        <input type="text" maxLength={50} {...propsCampo('lote')} />
      </Campo>

      <Campo id="fecha_caducidad" etiqueta="Fecha de caducidad" error={errores.fecha_caducidad}>
        <input type="date" {...propsCampo('fecha_caducidad')} />
      </Campo>

      <Campo id="precio_publico" etiqueta="Precio público ($)" error={errores.precio_publico}>
        <input type="number" min="0" step="0.01" inputMode="decimal" {...propsCampo('precio_publico')} />
      </Campo>

      <Campo id="stock_actual" etiqueta="Stock actual" error={errores.stock_actual}>
        <input type="number" min="0" step="1" inputMode="numeric" {...propsCampo('stock_actual')} />
      </Campo>

      <Campo id="stock_minimo" etiqueta="Stock mínimo" error={errores.stock_minimo}>
        <input type="number" min="0" step="1" inputMode="numeric" {...propsCampo('stock_minimo')} />
      </Campo>

      <Campo id="imagen_url" etiqueta="Imagen (ruta o URL)" obligatorio={false} error={errores.imagen_url}>
        <input type="text" maxLength={255} {...propsCampo('imagen_url')} />
      </Campo>

      <button type="submit" className={estilos.boton} disabled={enviando}>
        {enviando ? 'Guardando...' : textoBoton}
      </button>
    </form>
  );
}

export default MedicamentoForm;