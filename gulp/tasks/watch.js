var gulp   = require('gulp')
var config = require('../config')
var reload = require('browser-sync').reload

gulp.task('watch', function(){
  gulp.watch(config.sass.src, ['sass', reload])
  gulp.watch(config.watch.files, reload)
  // gulp.watch(config.html.src, config.html.opts, [reload])

  if (config.global.javascript_compiler == 'coffee') {
    gulp.watch(config.coffee.src, ['coffee', reload])
  } else if (config.global.javascript_compiler == 'es6') {
    gulp.watch(config.es6.src, ['es6', reload])
  }
})
