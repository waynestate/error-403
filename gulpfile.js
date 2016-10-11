var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();
var stylelint = require('stylelint');
var reporter = require('postcss-reporter');
var scss = require('postcss-scss');
var sym = require('gulp-sym');

// Where is the app?
var appDir = 'src/';

// Where do you store your Sass files?
var sassDir = appDir + 'scss';

// Which directory should the app compile to?
var targetAppDir = 'dist/';
var targetResourcesDir = targetAppDir;

gulp.task('styles', function () {
    gulp.src(sassDir + "/**/*.scss")
    // Capture all errors
        .pipe($.plumber())

        // Lint the scss
        .pipe($.postcss([
            stylelint(),
            reporter({clearMessages: true, throwError: true}),
        ], {syntax: scss}))

        // Compile the scss
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sass({
            includePaths: ['node_modules'],
        }).on('error', $.sass.logError))

        // Add suppost for older browsers
        .pipe($.autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))

        // Minify
        .pipe($.cssnano())

        // Write the files to the public directory
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(targetResourcesDir))
        .pipe($.size())
});

gulp.task('symlink', function(){
    gulp.src(targetAppDir)
        .pipe(sym('www.80', { force: true}));
    gulp.src(targetAppDir + '/403.css')
        .pipe(sym(targetAppDir + '/_resources/css/403.css', { force: true}));
    gulp.src(targetAppDir + '/403.css.map')
        .pipe(sym(targetAppDir + '/_resources/css/403.css.map', { force: true}));
    gulp.src(targetAppDir + '/403.png')
        .pipe(sym(targetAppDir + '/_resources/images/403.png', { force: true}));
});


// Default task
gulp.task('default', ['styles', 'symlink']);

// Keep an eye on Sass, JS, for changes...
gulp.task('watch', ['styles'], function () {
    gulp.watch(sassDir + '/**/*.scss', ['styles']);
});
