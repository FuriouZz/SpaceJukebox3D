var gulp       = require('gulp')
var config     = require('../config').sass
var rubySass   = require('gulp-ruby-sass')
var sourcemaps = require('gulp-sourcemaps')
var notify     = require('gulp-notify')
var reload     = require('browser-sync').reload

gulp.task('sass', function(){
  options          = config.opts
  options.loadPath = require('node-bourbon').includePaths

  return rubySass(config.srcPath, options)
          .on('error', notify.onError(function(error){
              return 'ERROR: ' + error
          }))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(config.dstPath))
})
