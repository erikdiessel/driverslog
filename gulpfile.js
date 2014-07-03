var gulp = require('gulp');
var concat = require('gulp-concat');


gulp.task('default', function() {
	gulp.src('./scripts/*.js')
    	.pipe(concat('all.js'))
    	.pipe(gulp.dest('./www/js/'));
    
    //gulp.src('./css/app.css')
    //	.pipe(gulp.dest('./www/css/'));
});