/**
 * Modules
 */
const browserify = require('browserify');
const gulp = require('gulp');
const environments = require('gulp-environments');
const sass = require('gulp-sass');
const nodeTildeImporter = require('node-sass-tilde-importer');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const mergeStream = require('merge-stream');
const browserSync = require('browser-sync').create();
const serveStatic = require('extension-serve-static');
const rimraf = require('rimraf');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const rename = require('gulp-rename');
const defineModule = require('gulp-define-module');
const precompileHandlebars = require('gulp-precompile-handlebars');
const declare = require('gulp-declare');
// const del = require('del');
const { src, dest, series } = require('gulp');
const handlebars = require('gulp-handlebars');
const merge = require('merge2');
const wrap = require('gulp-wrap');

/**
 * Configuration
 */
const configuration = {
    // SASS-files (multiple source-files are compiled to one target-file)
    sass: [
        {
            source: [
                'assets/scss/events.scss',
            ],
            target: 'public/assets/css/events.css',
            includePaths: [
                'assets/scss',
            ],
        },
        // {
        //     source: [
        //         'assets/scss/event-dashboard.scss',
        //     ],
        //     target: 'public/assets/css/event-dashboard.css',
        //     includePaths: [
        //         'assets/scss',
        //     ],
        // },
    ],
    // JavaScript-files (multiple source-files are compiled to one target-file)
    javaScript: [
        {
           source: [
                // 'assets/js/hbstemplates.js',
                'assets/js/events.js',
            ],
            target: 'public/assets/js/events.js',
        },
        {
            source: [
                'assets/js/events_v2.js',
            ],
            target: 'public/assets/js/events_v2.js',
        },
        {
            source: [
                'assets/js/events_v2_new.js',
            ],
            target: 'public/assets/js/events_v2_new.js',
        },
        {
            source: [
                'assets/js/events_v3.js',
            ],
            target: 'public/assets/js/events_v3.js',
        },
        {
            source: [
                'assets/js/events_jquery.js',
            ],
            target: 'public/assets/js/events_jquery.js',
        },
        {
            source: [
                'assets/js/events_rebuild.js',
            ],
            target: 'public/assets/js/events_rebuild.js',
        },
    ],
    images: [
        {
            source: [
                'assets/img/**',
            ],
            target: 'public/assets/img/',
        },
    ],
    //Handlebars
    handlebars: [
        {
            source: [
                'assets/js/handlebarsTemplates/*.hbs',
            ],
            source_partials: [
                'assets/js/handlebarsTemplates/_*.hbs',
            ],
            target: 'public/assets/js/handlebarsTemplates',
            //target: 'assets/js',
        },
    ],




    // Globs for watch-method
    watch: {
        // Rebuild JavaScript if one of the matches files were changed
        javaScript: [
            'assets/js/**/*.js',
        ],
    },

    // Files which should be cleaned
    clean: [
        'public/assets/**',
    ],
};

/**
 * Compile SCSS-files
 */
gulp.task('sass', function () {
    let streams = configuration.sass.map(function (file) {
        return gulp.src(file.source)
            .pipe(sourcemaps.init())
            .pipe(
                sass({
                    includePaths: file.includePaths,
                    onError: browserSync.notify,
                    importer: nodeTildeImporter
                }).on('error', sass.logError)
            )
            .pipe(
                autoprefixer({
                    cascade: true
                })
            )
            .pipe(concat(path.basename(file.target)))
            .pipe(environments.production(cleanCss()))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(path.dirname(file.target)))
            .pipe(browserSync.stream({
                match: '**/*.css'
            }));
    });

    return mergeStream(streams);
});

/**
 * Compile JavaScript-files
 */
gulp.task('scripts', function () {
    const streams = configuration.javaScript.map(function (file) {
        const b = browserify({
            entries: file.source,
            debug: true
        });

        return b.transform('babelify')
            .bundle()
            .pipe(source(path.basename(file.target)))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(environments.production(terser()))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(path.dirname(file.target)))
            .pipe(browserSync.stream({
                match: '**/*.js'
            }));
    });

    return mergeStream(streams);
});
/**
 * Copy images
 */
gulp.task('images', function () {
    let streams = configuration.images.map(function (file) {
        return gulp.src(file.source)
            .pipe(gulp.dest(file.target));
    });
    return mergeStream(streams);
});

/**
 * Precompile Handlebars-Template
 */
// gulp.task('handlebars', function () {
//     return gulp.src('assets/js/handlebarsTemplates/*.handlebars')
//         .pipe(precompileHandlebars())
//         .pipe(rename({ extname: '.js' }))
//             .pipe(defineModule('es6'))
//             .pipe(gulp.dest('public/assets/js/handlebarsTemplates'));
// });


gulp.task('handlebars', function () {
    let streams = configuration.handlebars.map(function (file) {
        //https://dev.to/honatas/properly-precompile-handlebars-templates-and-partials-with-gulp-4g91
        // function clean() {
        //     return del('public/assets/js/handlebarsTemplates');
        // }

        function templates() {
            return src(file.source)
                .pipe(rename((path) => {
                    if (path.basename.startsWith('_')) {
                        path.basename = path.basename.substring(1);
                    }
                }))
                .pipe(handlebars())
                .pipe(wrap('Handlebars.template(<%= contents %>)'))
                .pipe(declare({
                    namespace: 'Hbs',
                    noRedeclare: true,
                }));
        }

        function partials() {
            return src(file.source_partials)
                .pipe(handlebars())
                .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Hbs[<%= processPartialName(file.relative) %>]);', {}, {
                    imports: {
                        processPartialName: function(fileName) {
                            return JSON.stringify(path.basename(fileName, '.js').substring(1));
                        }
                    }
                }));
        }


        return merge(templates(), partials())
            .pipe(concat('hbstemplates.js'))
            .pipe(dest(file.target));


    });
    return mergeStream(streams);
});

/**
 * Clean generated files
 */
gulp.task('clean', function (done) {
    configuration.clean.map((path) => rimraf.sync(path));

    done();
});

/**
 * Build the project
 */
gulp.task('build', gulp.parallel('sass', 'handlebars', 'scripts', 'images'));




/**
 * Default task, running just `gulp` will only build the project
 */
gulp.task('default', gulp.parallel('build'));