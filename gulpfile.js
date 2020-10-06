// подключение модуля gulp
const gulp = require('gulp');
// объединение файлов
const concat = require('gulp-concat');
// добавление префиксов
const autoprefixer = require('gulp-autoprefixer');
// оптимизация стилей
const cleanCSS = require('gulp-clean-css');
// оптимизация скриптов
const uglify = require('gulp-uglify-es').default;
// удаление файлов
const del = require('del');
// синхронизация с браузером
const browserSync = require('browser-sync').create();
// для препроцессоров стилей
const sourcemaps = require('gulp-sourcemaps');
// препроцессор SASS
const sass = require('gulp-sass');
//const watch = require('gulp-watch');
// минимизация изображений
const imagemin = require('gulp-imagemin');
// модуль переименовывания файлов
const rename = require('gulp-rename');

// Порядок подключения css файлов
// const cssFiles = [
//     './src/css/main.css',
//     './src/css/media.css'
// ]
const styleFiles = [
    './src/scss/reset.scss',
    './src/scss/fonts.scss',
    './src/scss/styles.scss',
    './src/scss/media.scss'
]
// Порядок подключения js файлов
const scriptFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]
// таск на шрифты
gulp.task('fonts', () => { 
    return gulp.src('./src/fonts/**') 
    .pipe(gulp.dest('./build/fonts')); 
});
///*.{eot,svg,ttf,otf,woff,woff2}
// таск для обработки стилей
gulp.task('styles', () => {
    // Шаблон для поиска файлов CSS
    // Все файлы по шаблону './src/css/*folder*/*file*.css
    return gulp.src(styleFiles)
    // Для SCSS добавлено! от
    .pipe(sourcemaps.init())
    .pipe(sass())
    // для SCSS добавлено! до
    // Объединение файлов в один
    .pipe(concat('style.css'))
    // Автопрефиксер
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    // Минификация
    .pipe(cleanCSS({
        level: 2
    }))
    // Для SCSS добавлено! ниже
    .pipe(sourcemaps.write('./'))
    .pipe(rename({
        suffix: '.min'
    }))
    // Выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});
// таск для обработки скриптов
gulp.task('scripts', () =>  {
    // Шаблон для поиска файлов JS
    // Все файлы по шаблону './src/js/*folder*/*file*.js
    return gulp.src(scriptFiles)
    // Объединение файлов в один
    .pipe(concat('main.js'))
    // Минификация JS
    .pipe(uglify({
        toplevel: true
    }))
    .pipe(rename({
        suffix: '.min'
    }))
    // Выходная папка для скриптов
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});
// Таск для очистки папки build
gulp.task('del', () => {
    return del(['./build/*'])
});
// Таск на минимизацию изображений
gulp.task('img-compress', () => {
    return gulp.src('./src/img/**')
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest('./build/img/'))
})
// Таск на отслеживание изменений в файлах
gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/img/**', gulp.series('img-compress'))
    // Следить за CSS файлами        для scss изменены!!!!!
    //gulp.watch('./src/css/**/*.css', styles)
    gulp.watch('./src/scss/**/*.scss', gulp.series('styles'))
    gulp.watch('./src/scss/**/*.sass', gulp.series('styles'))
    // Следить за JS файлами
    gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
    // При изменении HTML запустить синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload);
});
// таск по умолчанию, запускает del, styles, scripts, watch
gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts', 'fonts', 'img-compress'), 'watch'));

// старые таски!
// таск вызывющий функцию styles
//gulp.task('styles', styles);
// таск вызывающий функцию scripts
//gulp.task('scripts', scripts);
// таск на очистку папки build
//gulp.task('del', clean);
// таск на отслеживание изменений
//gulp.task('watch', watch);
// таск для удаления файлов в папке Build и запуск styles и scripts
//gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
// таск запускает таск build и watch последовательно
//gulp.task('dev', gulp.series('build', 'watch'));
// таск на компиляцию SCSS
// gulp.task('sass-compile', function(){
//     return gulp.src('./src/scss/**/*.scss')
//     .pipe(sourcemaps.init())
//     .pipe(sass().on('error', sass.logError))
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('./src/css/'))
// });
// gulp.task('watch', function(){
//     gulp.watch('./src/scss/**/*.scss', gulp.series('sass-compile'))
// })
// watch - disable - ctrl+c