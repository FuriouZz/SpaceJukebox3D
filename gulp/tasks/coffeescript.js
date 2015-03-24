var gulp       = require('gulp')
var config     = require('../config').coffee
var sourcemaps = require('gulp-sourcemaps')
var coffee     = require('gulp-coffee')
var notify     = require('gulp-notify')
var reload     = require('browser-sync').reload

gulp.task('coffee', function(){
  return gulp.src(config.src)
        .pipe(sourcemaps.init())
        .pipe(coffee(config.opts).on('error', notify.onError(function(error){
            return 'ERROR: ' + error
        })))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dst))
})
