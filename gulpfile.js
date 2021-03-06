'use strict';
// generated on 2014-07-29 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var vm = require('vm');
var fs = require('fs');
var merge = require('deeply');
var connect = require('gulp-connect');


// for gulp-devtools in chrome
module.exports = gulp;

// load plugins
var $ = require('gulp-load-plugins')();

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('app/require.config.js') + '; require;');
var requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './app',
        name: 'scripts/game',
        paths: {
            requireLib: 'bower_components/requirejs/require'
        },
        include: [
            'requireLib'
        ],
        insertRequire: ['scripts/game'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
        }
    });


gulp.task('styles', function () {
    return gulp.src('app/styles/main.css')
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size())
        .pipe(connect.reload());
});

gulp.task('scripts', function () {
    return $.requirejsBundler(requireJsOptimizerConfig) //gulp.src('app/scripts/**/*.js')
        //.pipe($.jshint())
        //.pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe($.size())
        .pipe(connect.reload());
});

gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        //.pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        //.pipe(jsFilter)
        //.pipe($.uglify())
        //.pipe(jsFilter.restore())
        //.pipe(cssFilter)
        //.pipe($.csso())
        //.pipe(cssFilter.restore())
        //.pipe($.useref.restore())
        //.pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size())
        .pipe(connect.reload());
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size())
        .pipe(connect.reload());
});

gulp.task('fonts', function () {
    return $.bowerFiles()
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size())
        .pipe(connect.reload());
});

gulp.task('extras', function () {
    return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', function () {
    connect.server({
        root: 'app',
        port: 9000,
        livereload: true
    });

});

gulp.task('serve', function() {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function () {
    // watch for changes
    gulp.watch('app/*.html', ['html']);
    gulp.watch('app/**/*.css', ['styles']);
    gulp.watch('app/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});
