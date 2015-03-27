var fs         = require('fs');
var gulp       = require('gulp')
var config     = require('../config').browserify
var gutil      = require('gulp-util')
var notify     = require('gulp-notify')
var sourcemaps = require('gulp-sourcemaps')
var source     = require('vinyl-source-stream')
var buffer     = require('vinyl-buffer')
var watchify   = require('watchify')
var browserify = require('browserify')
var reload     = require('browser-sync').reload


var tree    = fs.readdirSync(config.modulePath)
var entries = [];

for (var i = 0; i < tree.length; i++) {
  entries.push(config.modulePath+tree[i])
}

watchify.args.entries    = entries
watchify.args.extensions = config.extensions

var bundler    = watchify(browserify(watchify.args))
bundler.transform('coffeeify')

gulp.task('browserify', bundle)
bundler.on('update', bundle)
bundler.on('log', gutil.log)

function bundle(){
  return bundler.bundle()
                .on('error', notify.onError(function(error){
                    return 'ERROR: ' + error
                }))
                .pipe(source(config.source))
                .pipe(buffer())
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(config.dstPath))
                .pipe(reload({ stream:true }))
}
