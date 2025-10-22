// ✅ Este script fue cargado desde src/js/main.js y será convertido por Gulp en bundle.min.js

// Crear la banda verde
const banda = document.createElement('div');
banda.style.backgroundColor = '#28a745'; // verde éxito
banda.style.color = '#fff';
banda.style.padding = '1rem';
banda.style.textAlign = 'center';
banda.style.fontFamily = 'Segoe UI, sans-serif';
banda.style.fontSize = '1.1rem';
banda.textContent = '✅ Bienvenido, Datenmaniak. El entorno Gulp + JS está funcionando correctamente.';

// Insertar al inicio del <body>
document.body.insertBefore(banda, document.body.firstChild);

// Notificación en consola
console.log('🟢 Mensaje de bienvenida insertado dinámicamente en el HTML.');
console.log('📦 Este mensaje fue generado por src/js/main.js y convertido por Gulp en build/js/bundle.min.js usando gulp-terser y gulp-concat.');
console.log('🧪 Si ves esta banda verde, significa que la conversión JS se logró correctamente.');
