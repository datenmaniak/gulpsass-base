# 🌐 Starter — Entorno Gulp + Sass + JS + Imágenes

Este proyecto es un entorno de desarrollo modular que compila Sass, minifica CSS/JS, optimiza imágenes y genera versiones WebP. Ideal para prototipos escalables, branding personalizado y automatización con Gulp.

---

## 🚀 Inicio rápido

```bash
npm install
npm run dev
```

## 📁 Estructura de carpetas

```
src/
├── index.html          # Página principal
├── scss/               # Estilos Sass
│   ├── main.scss       # Entrada principal
│   ├── _variables.scss # Tokens de color y tipografía
│   └── _mixins.scss    # Breakpoints y utilidades
├── js/
│   └── main.js         # Script dinámico (banda verde)
├── img/
│   ├── logo.png        # Logo optimizado y convertido a WebP
│   └── central.jpg     # Imagen central para <picture>
build/
├── css/                # CSS compilado y minificado
├── js/                 # JS concatenado y minificado
└── img/                # Imágenes optimizadas y WebP

```


## 🧪 ¿Qué tareas ejecuta Gulp?

| Tarea                 | Descripción                                                                 |
|-----------------------|------------------------------------------------------------------------------|
| `buildStyles`         | Compila archivos SCSS a CSS con sourcemaps para desarrollo.                 |
| `buildStylesMini`     | Minifica el CSS usando PostCSS con Autoprefixer y cssnano.                  |
| `generateJSmini`             | Concatena y minifica los scripts JS en `bundle.min.js` con sourcemaps.      |
| `resizeImagesForWebWithSharp`  | Optimiza imágenes desde `src/img` y las guarda en `build/img`.              |
| `cleanBuild`        | Limpia la carpeta `build/css` antes de compilar nuevos estilos.             |
| `watchFiles`        | Observa cambios en `.scss`, `.js` e imágenes para recompilar automáticamente.|

### Removed: 
| Tarea                 | Descripción                                                                 |
|-----------------------|------------------------------------------------------------------------------|
| `optimizeImages`         | Optimiza imágenes desde `src/img` y las guarda en `build/img`.              |
| `generateImagesWebp`| Convierte imágenes a formato WebP y las guarda en `build/img`.              |
| `minificarCSS`        | Aplica `gulp-clean-css` sobre el CSS generado para producción adicional.    |


## 🖼️ Compatibilidad de imágenes

Ejemplo de cómo usar las imágenes convertidas.
```
<picture>
  <source srcset="build/img/central.webp" type="image/webp" />
  <source srcset="build/img/central.jpg" type="image/jpeg" />
  <img src="build/img/central.png" alt="Imagen central" />
</picture>


```
# 🖼️ resizeImagesWithSharp() — Redimensionamiento moderno con Sharp

Esta función redimensiona imágenes desde `src/img` a resoluciones óptimas para la web (480px, 768px, 1280px) usando la librería `sharp`, sin depender de ImageMagick ni plugins obsoletos. Los archivos generados se guardan en `build/img`.

---

## ✅ Requisitos

Instala la dependencia:

```
npm install --save-dev sharp
```
### 📁 Estructura esperada
```
src/img/            <--- source 
├── logo.png
├── central.jpg
build/img/          <--- destination 
├── logo-sm.png
├── logo-md.png
├── logo-lg.png
├── central-sm.jpg
├── central-md.jpg
├── central-lg.jpg
```
### 🧩 Código de la función

```
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function resizeImagesWithSharp(done) {
  const inputDir = 'src/img';
  const outputDir = 'build/img';
  const sizes = [
    { width: 480, suffix: '-sm' },
    { width: 768, suffix: '-md' },
    { width: 1280, suffix: '-lg' }
  ];

  if (!fs.existsSync(inputDir)) {
    console.warn(`⚠️ La carpeta "${inputDir}" no existe.`);
    return done();
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.readdirSync(inputDir).forEach(file => {
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file, ext);

    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      sizes.forEach(size => {
        sharp(`${inputDir}/${file}`)
          .resize({ width: size.width })
          .toFile(`${outputDir}/${base}${size.suffix}${ext}`)
          .then(() => {
            console.log(`✅ ${file} → ${base}${size.suffix}${ext}`);
          })
          .catch(err => {
            console.error(`❌ Error al redimensionar ${file}:`, err.message);
          });
      });
    }
  });

  done();
}

```
### 🧪 Integración en Gulp
Agrega la función a tu flujo principal:

```
export default parallel(
  cleanBuild, 
  buildStyles, 
  buildStylesMini, 
  generateJS, 
  generateJSmini, 
  resizeImagesWithSharp,
  convertImagesToWebp,
   watchFiles
);

```

# 🖼️ convertImagesToWebp() — Conversión moderna a WebP con Sharp

Esta función convierte imágenes desde `src/img` al formato WebP, generando archivos optimizados en `build/img`. Utiliza la librería `sharp`, evitando dependencias externas como ImageMagick y asegurando compatibilidad con navegadores modernos.

---

## ✅ Requisitos

Instala la dependencia:

```bash
npm install sharp
```

## 📁 Estructura esperada
```
src/img/
├── logo.png
├── central.jpg
build/img/
├── logo.webp
├── central.webp
```












# 🧑‍💻 Autor
Datenmaniak — IT Freelancer, diseñador web modular, creador del ecosistema Violet Pulse.



> ℹ️ **Nota:** Para más información sobre las dependencias necesarias, consulta el archivo `package.json`. Allí se definen todos los paquetes requeridos para ejecutar esta función, incluyendo `sharp` y otras utilidades del entorno Gulp. Al ejecutar `npm install`, se instalarán automáticamente.

> 🛠️ **Nota técnica:** Si deseas generar únicamente una versión redimensionada a 480px y conservar el nombre original del archivo (sin sufijos como `-sm`, `-md`, `-lg`), puedes ajustar la función eliminando el bucle de tamaños y modificando la línea `.toFile()` para que use directamente el nombre base:

```js
  sharp(`${inputDir}/${file}`)
   .resize({ width: 480 })
   .toFile(`${outputDir}/${base}${ext}`)
```

> Esto sobrescribirá cualquier archivo existente con el mismo nombre en `build/img`, por lo que se recomienda usar una carpeta dedicada si deseas conservar el original.


# 🛠️ Documentación Técnica - Gulpfile Optimizado 

Este documento describe todas las tareas definidas en el `gulpfile.mjs`, junto con las mejoras aplicadas para robustez, reactividad y modularidad. Está diseñado para facilitar el onboarding técnico y mantener coherencia con la identidad de marca Violet Pulse.

---

## ✨ Mejoras Aplicadas

### 🔁 Watcher Reactivo

- Se corrigió el watcher para detectar cambios en archivos parciales SCSS (`_*.scss`)
- Se encadenaron tareas con `series()` para recompilar versiones normal y minificada
- Se eliminaron reinicios manuales de `npm run dev`

```js
watch(['src/scss/**/*.scss', 'src/scss/**/_*.scss'], series(buildStyles, buildStylesMini));
```

##  Estructura de Carpetas
```
src/scss/ → Archivos fuente SCSS

src/js/ → Scripts fuente JS

src/img/ → Imágenes fuente

build/css/ → CSS compilado y minificado

build/js/ → JS legible y minificado

build/img/ → Imágenes redimensionadas y convertidas a WebP
```

## 📋 Tabla de Tareas Gulp - Violet Pulse

| Tarea                      | Propósito                                                  | Mejoras Aplicadas                                      | Notas Relevantes                                  |
|---------------------------|-------------------------------------------------------------|--------------------------------------------------------|--------------------------------------------------|
| `cleanCSS`                | Elimina archivos en `build/css`                             | Uso de `deleteAsync`                                   | Limpieza previa a compilación                    |
| `cleanJS`                 | Elimina JS y sourcemaps en `build/js`                       | Uso de `deleteAsync`                                   | Evita residuos de versiones anteriores           |
| `buildStyles`             | Compila SCSS con sourcemaps y autoprefixer                  | `gulp-plumber`, log Violet Pulse, cierre de `sass()`   | Requiere `src/scss/**/*.scss`                    |
| `buildStylesMini`         | Compila y minifica SCSS con `cssnano`                       | `gulp-plumber`, log Violet Pulse, cierre de `sass()`   | Renombra con `.min`                              |
| `generateJS`              | Concatena y genera JS legible                               | Sourcemaps, log Violet Pulse                           | Usa `concat('bundle.js')`                        |
| `generateJSmini`          | Minifica JS y renombra con `.min`                           | Sourcemaps, log Violet Pulse                           | Usa `terser()` y `rename()`                      |
| `resizeImagesForWebWithSharp` | Redimensiona imágenes a 480px                             | Uso directo de `sharp`, verificación de carpetas       | Preserva nombre original                         |
| `convertImagesToWebp`     | Convierte imágenes a formato WebP                           | Uso directo de `sharp`, verificación de carpetas       | Aplica resize antes de conversión                |
| `watchFiles`              | Observa cambios en SCSS, JS e imágenes                      | Encadenamiento con `series()`, rutas parciales SCSS    | Evita reinicios manuales                         |
| `buildCSS`                | Limpia y compila SCSS (normal + minificado)                 | Encadenamiento con `series()`                          | Se usa en `default`                              |
| `buildJS`                 | Limpia y compila JS (normal + minificado)                   | Encadenamiento con `series()`                          | Se exporta como tarea individual                 |
| `buildImages`             | Redimensiona y convierte imágenes                           | Uso de `parallel()`                                    | Se usa en `default`                              |
| `default`                 | Ejecuta todas las tareas y activa el watcher                | Uso de `parallel()`, incluye `watchFiles`              | Se ejecuta con `npm run dev`                     |


## 📌 Recomendaciones futuras
 + Agregar notificaciones visuales (ej. node-notifier)

+ Generar logs con timestamp por tarea

+ Modularizar tareas en archivos separados (tasks/styles.js, tasks/scripts.js, etc.)

+ Documentar dependencias en README.md 




## ⚠️ **Nota sobre versiones del Gulpfile**
>
> Para propósitos de ensayo y como medida de respaldo ante posibles errores en esta nueva versión optimizada, se conservará el `gulpfile.mjs` anterior completamente funcional. Esta versión ha sido movida al directorio `old-release/`, donde permanecerá disponible para comparación, validación de mejoras y reversión temporal si fuese necesario.
>
> Ambas versiones pueden coexistir en el proyecto, diferenciadas por nombre o ubicación, hasta que se confirme la estabilidad total del flujo optimizado.
