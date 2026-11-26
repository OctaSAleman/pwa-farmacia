// Registro del Service Worker (public/sw.js)
// Solo en producción (npm run build + npm run preview), para que en
// desarrollo la caché no esconda los cambios que vamos haciendo.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => console.log('Service Worker registrado con alcance:', reg.scope))
      .catch((err) => console.error('Error al registrar el Service Worker:', err));
  });
}
