var gulp   = require('gulp')
var config = require('../config')

gulp.task('compile', ['sass', 'browserify'])
gulp.task('default', ['browserSync', 'compile', 'watch'])
