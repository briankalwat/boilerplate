var gulp = require('gulp');
	jade = require('gulp-jade');
	uglify = require('gulp-uglify');
	gulpif = require('gulp-if');
	sass = require('gulp-sass');
	livereload = require('gulp-livereload');
	express = require('express');
	app = express();

var env = process.env.NODE_ENV || 'development';
// NODE_ENV=production

var outputDir = 'compiled';

gulp.task('jade', function() {
	return gulp.src('_src/templates/**/*.jade')
		.pipe(jade())
		.pipe(gulp.dest(outputDir))
		.pipe(livereload());
})


gulp.task('js', function() {
	return gulp.src('_src/js/**/*.js')
	.pipe(gulpif(env === 'production', uglify()))
	.pipe(gulp.dest(outputDir + '/js'))
	.pipe(livereload());
})


gulp.task('sass', function(){
	var config = {};

	if (env === 'development') {
		// config.sourceComments = 'map';
	}

	if (env === 'production') {
		config.outputStyle = 'compressed';
	}

	return gulp.src('_src/sass/master.scss')
		.pipe(sass(config))
		.pipe(gulp.dest(outputDir + '/css'))
		.pipe(livereload());
});


gulp.task('webserver', function() {
  	app.use(express.static(__dirname + '/compiled'));
  	var port = process.env.PORT || 8000;
  	app.listen(port);
});


gulp.task('watch', function(){
	gulp.watch('_src/templates/**/*.jade', ['jade']);
	gulp.watch('_src/js/**/*.js', ['js']);
	gulp.watch('_src/sass/**/*.scss', ['sass']);
});


gulp.task('default', ['js', 'jade', 'sass', 'watch', 'webserver']);