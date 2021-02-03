// Определение констант Gulp
const { src, dest, parallel, series, watch } = require("gulp");

const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");
const gulpif = require("gulp-if");
const yargs = require("yargs").argv;
const notify = require("gulp-notify");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const size = require("gulp-size");
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const changed = require("gulp-changed");
const recompress = require("imagemin-jpeg-recompress");
const del = require("del");
const gcmq = require("gulp-group-css-media-queries");
const svgmin = require("gulp-svgmin");
const svgsprite = require("gulp-svg-sprite");
const ttf2woff2 = require("gulp-ttftowoff2");
const ttf2woff = require("gulp-ttf2woff");
const ttf2eot = require("gulp-ttf2eot");

const jsFiles = [
  "node_modules/swiper/swiper-bundle.js",
  "!app/js/main.min.js",
  "app/js/main.js",
];

const isProduction = yargs.env === "production" ? true : false;

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "./app",
      index: "index.html",
    }, // Папка сервера (Исходные файлы)
    notify: false,
    online: true,
    open: false,
  });
}

function html() {
  return src("app/pug/pages/*.pug")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      pug({
        pretty: !isProduction, // Форматирование при сжатии (false)
      })
    )
    .pipe(dest("dist/"))
    .pipe(
      size({
        gzip: true,
        pretty: true,
        showFiles: true,
        showTotal: true,
      })
    )
    .pipe(browserSync.reload({ stream: true }));
}

function scripts() {
  return src(jsFiles)
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(gulpif(isProduction, uglify())) // Сжатие JavaScript кода
    .pipe(concat("main.min.js"))
    .pipe(dest("dist/js/"))
    .pipe(
      size({
        gzip: true,
        pretty: true,
        showFiles: true,
        showTotal: true,
      })
    )
    .pipe(browserSync.reload({ stream: true }));
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(
      sass({
        outputStyle: "expanded", // "compressed"
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 8 versions"],
        cascade: true,
        browsers: [
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 11",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6",
        ],
      })
    ) // Добавляет вендорные префиксы
    .pipe(gcmq()) //Группирует медиа
    .pipe(
      gulpif(
        isProduction,
        cleancss({
          level: {
            2: {
              specialComments: 0,
              // format: "beautify",
            },
          },
        })
      )
    )
    .pipe(concat("style.min.css"))
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(dest("dist/css/"))
    .pipe(
      size({
        gzip: true,
        pretty: true,
        showFiles: true,
        showTotal: true,
      })
    )
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return src([
    "app/images/**/*.+(jpg|jpeg|png|gif|svg|ico)",
    "!app/images/icons",
    "!app/images/sprite.svg",
  ])
    .pipe(changed("dist/images")) // не сжимать изображения повторно
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      imagemin(
        {
          interlaced: true,
          progressive: true,
          optimizationLevel: 5,
        },
        [
          recompress({
            loops: 6,
            min: 50,
            max: 90,
            quality: "high",
            use: [
              pngquant({
                quality: [0.65, 0.8],
                strip: true,
                speed: 1,
                floyd: 0,
              }),
            ],
          }),
          imagemin.gifsicle(),
          imagemin.optipng(),
          mozjpeg({
            quality: 85,
            progressive: true,
          }),
          imagemin.svgo(),
        ]
      )
    )
    .pipe(dest("dist/images"))
    .pipe(
      size({
        gzip: true,
        pretty: true,
        showFiles: true,
        showTotal: true,
      })
    )
    .pipe(browserSync.reload({ stream: true }));
}

function svg2sprite() {
  return src("app/images/icons/*.svg")
    .pipe(changed("dist/images/icons")) // не сжимать изображения повторно
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      svgmin({
        plugins: [
          {
            removeComments: true,
          },
          {
            removeEmptyContainers: true,
          },
        ],
      })
    )
    .pipe(
      svgsprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
          symbol: false,
        },
      })
    )
    .pipe(dest("dist/images"))
    .pipe(
      size({
        gzip: true,
        pretty: true,
        showFiles: true,
        showTotal: true,
      })
    )
    .pipe(browserSync.reload({ stream: true }));
}

function woff() {
  return src("app/fonts/*.ttf")
    .pipe(
      changed("dist/fonts", {
        extension: ".woff",
        hasChanged: changed.compareLastModifiedTime,
      })
    )
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(ttf2woff())
    .pipe(dest("dist/fonts/"));
}

function woff2() {
  return src("app/fonts/*.ttf")
    .pipe(
      changed("dist/fonts", {
        extension: ".woff2",
        hasChanged: changed.compareLastModifiedTime,
      })
    )
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(ttf2woff2())
    .pipe(dest("dist/fonts/"));
}

function eot() {
  return src("app/fonts/*.ttf")
    .pipe(
      changed("dist/fonts", {
        extension: ".eot",
        hasChanged: changed.compareLastModifiedTime,
      })
    )
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(ttf2eot())
    .pipe(dest("dist/fonts/"));
}

function fonts() {
  return src("app/fonts/*").pipe(dest("dist/fonts"));
}

function cleanimg() {
  return del("dist/images/**/*", {
    force: true,
  }); // Удаляем содержимое папки "dist/images"
}

function startwatch() {
  watch("app/pug/**/*.pug", html);

  watch("app/scss/**/*.scss", styles);

  watch(["app/js/*.js", "!app/js/*.min.js"], scripts);

  watch("app/images/**/*.+(jpg|jpeg|png|gif|svg|ico)", images);

  watch("app/images/icons/*.svg", svg2sprite);
}

exports.browsersync = browsersync;

exports.html = html;

exports.scripts = scripts;

exports.styles = styles;

exports.images = images;

exports.svg2sprite = svg2sprite;

exports.towoff = woff;

exports.towoff2 = woff2;

exports.toeot = eot;

exports.cleanimg = cleanimg;

exports.fonts = series(woff, woff2, eot);

exports.default = series(
  parallel(
    html,
    scripts,
    styles,
    images,
    svg2sprite,
    fonts,
    browsersync,
    startwatch
  )
);
