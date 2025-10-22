# 🌐 Violet Pulse Starter — Entorno Gulp + Sass + JS + Imágenes

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

| Tarea               | Descripción                                                                 |
|---------------------|------------------------------------------------------------------------------|
| `buildStyles`       | Compila archivos SCSS a CSS con sourcemaps para desarrollo.                 |
| `generateCssmini`   | Minifica el CSS usando PostCSS con Autoprefixer y cssnano.                  |
| `minificarCSS`      | Aplica `gulp-clean-css` sobre el CSS generado para producción adicional.    |
| `generateJS`        | Concatena y minifica los scripts JS en `bundle.min.js` con sourcemaps.      |
| `optimizeImages`    | Optimiza imágenes desde `src/img` y las guarda en `build/img`.              |
| `generateImagesWebp`| Convierte imágenes a formato WebP y las guarda en `build/img`.              |
| `cleanBuild`        | Limpia la carpeta `build/css` antes de compilar nuevos estilos.             |
| `watchFiles`        | Observa cambios en `.scss`, `.js` e imágenes para recompilar automáticamente.|

## 🖼️ Compatibilidad de imágenes

Ejemplo de cómo usar las imágenes convertidas.
```
<picture>
  <source srcset="build/img/central.webp" type="image/webp" />
  <source srcset="build/img/central.jpg" type="image/jpeg" />
  <img src="build/img/central.png" alt="Imagen central" />
</picture>


```
##  Pendiente: corregir la conversión de imágenes



```|

```

