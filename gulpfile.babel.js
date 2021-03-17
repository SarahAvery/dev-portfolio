const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");
//const register = require("@babel/register");

function transpileJS() {
  return src("./resources/js/**/*.js")
    .pipe(plumber())
    .pipe(
      babel({
        presets: [
          [
            "@babel/env",
            {
              modules: false,
            },
          ],
        ],
      })
    )
    .pipe(dest("./dist/js/"));
}

//END//

function copyImgs() {
  return src("./resources/img/**/*").pipe(dest("./dist/img/"));
}

function copyCss() {
  return src("./resources/css/**/*").pipe(dest("./dist/css/"));
}

function copyHtml() {
  console.log("html");
  return src("./pages/**/*.html").pipe(dest("./dist/"));
}

function css() {
  return src("./resources/scss/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./dist/css"))
    .pipe(browserSync.stream());
}

function bSync(done) {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    open: false,
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function clean(type) {
  return function cleanType(done) {
    require("child_process").execSync("rm -rf ./dist/" + type);
    done();
  };
}

exports.build = function () {
  console.log("production");
};

exports.default = function () {
  bSync();
  transpileJS();
  watch("resources/scss/**/*.scss", { ignoreInitial: false }, series(clean("css"), css, copyCss));
  watch("pages/*.html", { ignoreInitial: false }, series(copyHtml, copyImgs, reload));
  watch("resources/js/*.js", { ignoreInitial: false }, series(clean("js"), transpileJS, reload));
};
