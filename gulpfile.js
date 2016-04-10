var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require("browser-sync");
var runSequence = require("run-sequence");
var reload = browserSync.reload;
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var del = require('del');
var print = require('gulp-print');
var gutil = require('gulp-util');
var cssmin = require('gulp-cssmin');

// Path
var path = {
    dist: {
        clean: 'build/*',
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/**/*.html',
        js: ['src/js/**/*.js', '!src/js/vendor/**/*.js'],
        vendor_js: 'src/js/vendor/**/*.js',
        scss_main: 'src/scss/main.scss',
        scss: 'src/scss/**/*.scss',
        vendor_css: 'src/scss/vendor/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};

//Server config
var config = {
    server: {
        baseDir: './' + path.dist.html
    },
    tunnel: true,
    host: 'localhost',
    //port: 8080,
    logPrefix: "browser-sync"
};

gulp.task('webserver', function () {
    browserSync(config);
});

var console_log = function (string) {
    return print(function (path) {
        return "  => " + string + ": { " + path + " }";
    })
}

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.dist.html))
        .pipe(console_log('HTML'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('scss', function () {
    gulp.src(path.src.scss_main)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(path.dist.css))
        .pipe(console_log('SCSS'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('css:vendor', function () {
    gulp.src(path.src.vendor_css)
        .pipe(cssmin())
        .pipe(gulp.dest(path.dist.css + 'vendor/'))
        .pipe(console_log('VENDOR CSS'))
        .pipe(reload({
            stream: true
        }));
});


gulp.task('js', function () {
    gulp.src(path.src.js)
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js))
        .pipe(console_log('JS'))
        .pipe(reload({
            stream: true
        }));
});
gulp.task('js:vendor', function () {
    gulp.src(path.src.vendor_js)
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js + 'vendor/'))
        .pipe(console_log('VENDOR JS'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('image', function () {
    del([path.dist.img + '*'])
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img))
        .pipe(console_log('IMAGE'))
        .pipe(reload({
            stream: true
        }));
});


gulp.task('fonts', function () {
    gulp.src(path.src.fonts)
        .pipe(console_log('FONT'))
        .pipe(gulp.dest(path.dist.fonts))
});


gulp.task('clean', function () {
    return del([path.dist.clean]);
});

gulp.task('vendor', function (callback) {
    runSequence(
        'js:vendor',
        'css:vendor',
        callback
    )
});

gulp.task('build', function (callback) {
    runSequence(
        'clean',
        'html',
        'js',
        'scss',
        'fonts',
        'image',
        'vendor',
        callback
    )
});


gulp.task('watch', function () {
    gulp.watch(path.src.html, ['html']);
    gulp.watch(path.src.js, ['js']);
    gulp.watch(path.src.vendor_js, ['js:vendor']);
    gulp.watch(path.src.scss, ['scss']);
    gulp.watch(path.src.vendor_css, ['css:vendor']);
    gulp.watch(path.src.img, ['image']);
    gulp.watch(path.src.fonts, ['fonts']);

});


gulp.task('default', function () {
    runSequence('build', 'webserver', 'watch')
});