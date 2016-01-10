var gulp = require('gulp'),
		plumber = require('gulp-plumber'),
		rename = require('gulp-rename'),
		autoprefixer = require('gulp-autoprefixer'),
		concat = require('gulp-concat'),
		jshint = require('gulp-jshint'),
		uglify = require('gulp-uglify'),
		minifycss = require('gulp-minify-css'),
		sass = require('gulp-sass'),
		inlinesource = require('gulp-inline-source'),
		foreach = require('gulp-foreach'),
		data = require('gulp-data'),
		inject = require('gulp-inject'),
		del = require('delete'),
		template = require('gulp-template');


gulp.task('minify', function(){
	return gulp.src('source/scss/themes/*.scss')
		.pipe(sass())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(minifycss())
		.pipe(gulp.dest('source/temp/'))
});

gulp.task('minifyjs', ['minify'], function(){
	return gulp.src('source/js/script.js')
		.pipe(uglify())
		.pipe(gulp.dest('source/temp/'))
});


gulp.task('compile', ['minify','minifyjs'], function () {
  return gulp.src('source/temp/*.css')
    .pipe(foreach(function(stream, file){
    	var filename = file.path.match(/.*\/(.+?)\./)[1]; // + '.html';
 
		return gulp.src('source/html/main.html').pipe(inject(gulp.src(['source/temp/script.js', file.path]),{
			starttag: '<!-- inject:doxy:{{ext}} -->',
			removeTags: true,
			transform: function (filePath, file) {
				return file.contents.toString('utf8')
			}
		}))
		.pipe(rename(filename+'.html'))
		.pipe(gulp.dest('dist/'));

    }));
});

gulp.task('clean', ['minify','minifyjs', 'compile'], function(){
	return del(['source/temp/**'], function(err) {
	  if (err) throw err;
	  	console.log('done!');
	});
});


gulp.task('default', ['minify','minifyjs','compile','clean'], function(){
	gulp.watch(["source/js/**/*","source/scss/**/*","source/html/**/*"], ['minify','minifyjs','compile','clean']);
});