var gulp   = require('gulp')
var config = require('../config')

if (config.global.javascript_compiler == 'coffee') {
  gulp.task('compile', ['sass', 'coffee'])
} else if (config.global.javascript_compiler == 'es6') {
  gulp.task('compile', ['sass', 'es6'])
}

gulp.task('default', ['browserSync', 'compile', 'watch'])
