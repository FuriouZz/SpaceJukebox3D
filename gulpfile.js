// Paths
var cfg = require('./config.json');
var paths = cfg;

var projectName = require('./package.json').name;
hostname = projectName.toLowerCase().replace(/\s/g, '')+'.dev';

// Gulp
var gulp    = require('gulp'),
gp          = require('gulp-load-plugins')(),

browserSync = require('browser-sync'),
reload      = browserSync.reload;

var isDev  = true;
if(/(production|prod)/.test(process.env.NODE_ENV)) {
  isDev  = false;
}

gulp.task('sass', function(){
    sassOptions = {
        sourcemap: false,
        loadPath: require('node-bourbon').includePaths
    };

    return gp.rubySass(paths.base.src, sassOptions)
             .on('error', gp.notify.onError(function(error){
                return "ERROR: " + error
             }))
             .pipe(gp.sourcemaps.write())
             .pipe(gulp.dest(paths.base.dest))
})

gulp.task('coffee', function() {
    return gulp.src(paths.scripts.src+'**/*.coffee')
             .pipe(gp.sourcemaps.init())
             .pipe(gp.coffee({bare: true}).on('error', gp.notify.onError(function(error){
                return "ERROR: " + error
             })))
             .pipe(gp.sourcemaps.write())
             .pipe(gulp.dest(paths.scripts.dest))
})

gulp.task('watch', ['compile'], function(){
    gulp.watch(paths.styles.src+'**/*.{scss,sass}', ['sass', reload])
    gulp.watch(paths.scripts.src+'**/*.coffee',     ['coffee', reload])
    gulp.watch('**/*.html', {cwd: paths.base.dest}, reload)
})

gulp.task('serve', function(){
    browserSync({
        open: false,
        proxy: 'spacejukebox.dev',
        watchOptions: {
            debounceDelay: 1000
        },
    })
    gp.notify('Server launched')
})

gulp.task('bower', function(){
    return gp.bower('public/vendors')
})

gulp.task('compile', ['sass', 'coffee'])
gulp.task('default', ['serve','watch']);
