var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var revReplace = require('gulp-rev-replace');

gulp.task('reset', function () {
    return gulp.src('public/**', {read: false,force:true})
        .pipe(clean());
});

gulp.task('minify-css', ['minify-js'], function () {
    return gulp.src('css/*.css')
        .pipe(concat('all.css'))
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest("public"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("."));
});

gulp.task('minify-js', ['reset'], function () {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest("public"));
});

gulp.task("index",["minify-css"], function() {
    var manifest = gulp.src("rev-manifest.json");
    return gulp.src("index.html")
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest("public"));
});

gulp.task('compile', ['index'], function () {

});