// Validación de un medicamento (misma lógica que server/utils/validaciones.js)
// Devuelve un objeto con los errores por campo. Si está vacío, los datos son válidos.

export const PRESENTACIONES = ['Tabletas', 'Jarabe', 'Ampolletas', 'Cápsulas', 'Pomada'];

function textoVacio(valor) {
  return valor === undefined || valor === null || String(valor).trim() === '';
}

export function validarMedicamento(datos = {}) {
  const errores = {};

  // Campos de texto obligatorios con su largo máximo
  const textos = [
    ['nombre_comercial', 'El nombre comercial', 100],
    ['sustancia_activa', 'La sustancia activa', 100],
    ['concentracion', 'La concentración', 50],
    ['lote', 'El lote', 50],
  ];
  for (const [campo, nombre, max] of textos) {
    if (textoVacio(datos[campo])) {
      errores[campo] = `${nombre} es obligatorio.`;
    } else if (String(datos[campo]).trim().length > max) {
      errores[campo] = `${nombre} no puede tener más de ${max} caracteres.`;
    }
  }

  // Presentación: solo los valores permitidos
  if (textoVacio(datos.presentacion)) {
    errores.presentacion = 'Selecciona una presentación.';
  } else if (!PRESENTACIONES.includes(datos.presentacion)) {
    errores.presentacion = 'La presentación no es válida.';
  }

  // Fecha de caducidad con formato AAAA-MM-DD
  if (textoVacio(datos.fecha_caducidad)) {
    errores.fecha_caducidad = 'La fecha de caducidad es obligatoria.';
  } else if (
    !/^\d{4}-\d{2}-\d{2}$/.test(String(datos.fecha_caducidad).slice(0, 10)) ||
    Number.isNaN(Date.parse(String(datos.fecha_caducidad).slice(0, 10)))
  ) {
    errores.fecha_caducidad = 'La fecha de caducidad no es válida.';
  }

  // Precio: número mayor o igual a 0
  if (textoVacio(datos.precio_publico)) {
    errores.precio_publico = 'El precio es obligatorio.';
  } else if (!Number.isFinite(Number(datos.precio_publico)) || Number(datos.precio_publico) < 0) {
    errores.precio_publico = 'El precio debe ser un número mayor o igual a 0.';
  }

  // Stock: enteros mayores o iguales a 0
  const stocks = [
    ['stock_actual', 'El stock actual'],
    ['stock_minimo', 'El stock mínimo'],
  ];
  for (const [campo, nombre] of stocks) {
    if (textoVacio(datos[campo])) {
      errores[campo] = `${nombre} es obligatorio.`;
    } else if (!Number.isInteger(Number(datos[campo])) || Number(datos[campo]) < 0) {
      errores[campo] = `${nombre} debe ser un número entero mayor o igual a 0.`;
    }
  }

  // Imagen: opcional, máximo 255 caracteres
  if (!textoVacio(datos.imagen_url) && String(datos.imagen_url).trim().length > 255) {
    errores.imagen_url = 'La ruta de la imagen no puede tener más de 255 caracteres.';
  }

  return errores;
}
