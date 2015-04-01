var gulp = require('gulp'),
    sass = require('gulp-sass'),
    nodemon = require('gulp-nodemon');

gulp.task('sass', function () {
    return gulp.src('./sass/style.scss')
            .pipe(sass({ includePaths : ['_/sass/'] }))
            .pipe(gulp.dest('public/css'));
});


// The default task (called when you run `gulp`)
gulp.task('default', function() {
  nodemon({script: './bin/www'})
  gulp.run('sass');

  // Watch files and run tasks if they change

  gulp.watch('sass/*.scss', ['sass'], function() {
    gulp.run('sass');
  })
});
