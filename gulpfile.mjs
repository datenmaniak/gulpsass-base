// gulpfile.mjs
'use strict';

import { src, dest, watch, series, parallel } from 'gulp';

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
import imageResize from 'gulp-image-resize';
import sharp from 'sharp';

import {deleteAsync} from 'del';

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
export function cleanCSS() {
  return deleteAsync(['build/css/*']);
}

export function cleanJS() {
    return deleteAsync(['build/js/**/*.{js,map}']);
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
      console.error('[buildStylesMini] ❌ Error al compilar SCSS ', err.message);
    }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css'));
}

function generateJS() {
  // crear JS normal, legible para usuarios
  ensureFolder('src/js', 'carpeta de scripts JS');
  return src(paths.js)
  .pipe(sourcemaps.init())
  .pipe(terser({ format: { beautify: true } }))
  .pipe(concat('bundle.js')) // nombre legible sin .min
  .on('error', err => {
    console.error('[generateJS] ❌ Error al generar los estilos:', err.message);
  })
  .pipe(dest('build/js'));
}

function generateJSmini() {
  // crear JS minificado
  ensureFolder('src/js', 'carpeta de scripts JS');
  return src(paths.js)
  .pipe(sourcemaps.init())
  .pipe(concat('bundle.js'))
  .pipe(terser())
  .on('error', err => {
    console.error('[generateJSmini] ❌ Error al minificar JS', err.message);
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



//  Esta función fue ajustada para generar solo una imagen, con un ancho de 480px.
//  sin extensiones agregadas (-sm, -md, -lg)
// se preserva el nombre original del archivo
function resizeImagesForWebWithSharp(done) {
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

function convertImagesToWebp(done) {
  const inputDir = 'src/img';
  const outputDir = 'build/img';

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
      sharp(`${inputDir}/${file}`)
         .resize({ width: 480 })
        .toFormat('webp')
        .toFile(`${outputDir}/${base}.webp`)
        .then(() => {
          console.log(`✅ ${file} → ${base}.webp`);
        })
        .catch(err => {
          console.error(`❌ Error al convertir ${file} a WebP:`, err.message);
        });
    }
  });

  done();
}



function watchFiles() {
  watch(paths.scss, buildStyles);
  watch(paths.js, generateJS);
  // watch(paths.images, optimizeImages);
  watch(paths.images, resizeImagesForWebWithSharp);
  watch(paths.images, convertImagesToWebp);
}

console.log('🚀 Iniciando build...');

const buildCSS = series(cleanCSS, buildStyles, buildStylesMini);
const buildImages = parallel(resizeImagesForWebWithSharp, convertImagesToWebp);
export const buildJS = series(cleanJS, generateJS, generateJSmini);

export default parallel(buildCSS, buildJS, buildImages, watchFiles);



