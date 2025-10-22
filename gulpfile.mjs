// gulpfile.mjs
'use strict';

import { src, dest, watch, parallel } from 'gulp';

import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import clearCSS from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
// import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
// import webp from 'gulp-webp';
// import imageminWebp from 'imagemin-webp';
import fs from 'fs';
import path from 'path';
import {deleteAsync} from 'del';
import imageResize from 'gulp-image-resize';
import sharp from 'sharp';

const paths = {
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  images: 'src/img/**/*'
};

// ✅ Función reutilizable para verificar y crear carpetas
function ensureFolder(folderPath, label = 'carpeta') {
  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️ La ${label} "${folderPath}" no existe.`);

    try {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`📁 Se ha creado automáticamente la ${label}: ${folderPath}`);
    } catch (error) {
      console.error(`❌ Error al crear la ${label}: ${folderPath}`);
      console.error(error.message);
    }
  }
}

// 🧼 Limpia la carpeta build/css
export function cleanBuild() {
  return deleteAsync(['build/css/*']);
}

function buildStyles() {
  ensureFolder('src/scss', 'carpeta SCSS');
  return src(paths.scss)
    .pipe(sourcemaps.init())  // a partir de aqui, compruebo  #1
    .pipe(sass()
    .on('error', err => { // function compile de Dart Sass
      console.error('❌ Error al compilar:', err.message);
    }))
    .pipe(postcss([autoprefixer()]))   // #2
    // .on('error', sass.logError))
    .pipe(dest('build/css'));
};


function buildStylesMini() {
  ensureFolder('src/scss', 'carpeta SCSS');
  return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass()
    .on('error', err => { // function compile de Dart Sass
      console.error('❌ Error al compilar SCSS (generateCssmini):', err.message);
    }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css'));
}

function generateJS() {
  ensureFolder('src/js', 'carpeta de scripts JS');
  return src(paths.js)
  .pipe(sourcemaps.init())
  // .pipe(concat('bundle.js'))
  .pipe(terser())
  .on('error', err => {
    console.error('❌ Error al generar los estilos:', err.message);
  })
  // .pipe(rename({ suffix: '.min' })) // renombrar antes de escribir sourcemaps
  // .pipe(sourcemaps.write('.'))
  .pipe(dest('build/js'));
}

function generateJSmini() {
  ensureFolder('src/js', 'carpeta de scripts JS');
  return src(paths.js)
  .pipe(sourcemaps.init())
  .pipe(concat('bundle.js'))
  .pipe(terser())
  .on('error', err => {
    console.error('❌ Error al minificar JS', err.message);
  })
  .pipe(rename({ suffix: '.min' })) // renombrar antes de escribir sourcemaps
  .pipe(sourcemaps.write('.'))
  .pipe(dest('build/js'));
}

// function optimizeImages() {
//   ensureFolder('src/img', 'carpeta de imágenes');
//   return src(paths.images)
//     .pipe(newer('build/img'))
//     .pipe(imagemin({ optimizationLevel: 3 }))
//     .on('error', err => {
//       console.error('❌ Error al optimizar imágenes:', err.message);
//     })
//     .pipe(dest('build/img'));
// }

// function generateImagesWebp() {
//   ensureFolder('src/img', 'carpeta de imágenes');
//   return src(paths.images)
//     // .pipe(webp())
//     .pipe(imagemin({quality:50}))
//     .on('error', err => {
//       console.error('❌ Error al generar imágenes WebP:', err.message);
//     })
//     .pipe(dest('build/img'));
// }

function resizeImagesForWeb() {
  ensureFolder('src/img', 'carpeta de imágenes');

  const sizes = [
    { width: 480, suffix: '-sm' },
    { width: 768, suffix: '-md' },
    { width: 1280, suffix: '-lg' }
  ];

  const tasks = sizes.map(size => {
    return src(paths.images)
      .pipe(newer(`build/img`))
      .pipe(imageResize({
        width: size.width,
        upscale: false,
        imageMagick: true
      }))
      .pipe(rename({ suffix: size.suffix }))
      .on('error', err => {
        console.error(`❌ Error al redimensionar a ${size.width}px:`, err.message);
      })
      .pipe(dest('build/img'));
  });

  return Promise.all(tasks.map(task => new Promise((resolve, reject) => {
    task.on('end', resolve);
    task.on('error', reject);
  })));
}

//  Esta función fue ajustada para generar solo una imagen, con un ancho de 480px.
//  sin extensiones agregadas (-sm, -md, -lg)
// se preserva el nombre original del archivo
function resizeImagesWithSharp(done) {
  ensureFolder('src/img', 'carpeta de imágenes');
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
          // .resize({ width: size.width })
          .resize({ width: 480 })
          // .toFile(`${outputDir}/${base}${size.suffix}${ext}`)
          .toFile(`${outputDir}/${base}${ext}`)
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


function watchFiles() {
  watch(paths.scss, buildStyles);
  watch(paths.js, generateJS);
  // watch(paths.images, optimizeImages);
  watch(paths.images, resizeImagesWithSharp);
  // watch(paths.images, generateImagesWebp);
}

console.log('🚀 Iniciando build...');
export default parallel(cleanBuild, buildStyles, 
  buildStylesMini, generateJS, generateJSmini, 
  resizeImagesWithSharp, watchFiles);
