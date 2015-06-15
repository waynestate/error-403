var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();

// Where is the app?
var appDir = 'src/';

// Where do you store your Sass files?
var sassDir = appDir + 'scss';

// Which directory should the app compile to?
var targetAppDir = 'dist/';
var targetResourcesDir = targetAppDir;

// Which directory should Sass compile to?
var targetCSSDir = targetResourcesDir + '';

// Bower Dir
var bowerDir = 'bower_components';

// Foundation JS Dir
var foundationJsDir = bowerDir + '/foundation/js/foundation';

gulp.task('styles', function () {
    return gulp.src(sassDir + '/403.scss')
        .pipe($.plumber())
        .pipe($.rubySass({
            style: 'expanded',
            loadPath: ['bower_components'],
            compass: false,
            bundleExec: true
        }))
        .pipe($.autoprefixer('last 5 version'))
        .pipe($.minifyCss())
        .pipe(gulp.dest(targetCSSDir))
        .pipe($.size());
});

// Default task
gulp.task('default', ['styles']);

// Keep an eye on Sass, JS, for changes...
gulp.task('watch', ['styles'], function () {

    // Initialize livereload
    $.livereload = $.livereload();

    gulp.watch(targetAppDir + '403.css', function (file) {
        $.livereload.changed(file.path);
    });

    gulp.watch(sassDir + '/**/*.scss', ['styles']);
});
