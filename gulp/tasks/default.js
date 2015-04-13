var gulp   = require('gulp')
var config = require('../config')

gulp.task('compile', ['sass', 'coffee'])
gulp.task('default', ['browserSync', 'compile', 'watch'])
