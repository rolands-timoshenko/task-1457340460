var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var revReplace = require('gulp-rev-replace');

/**
 * Clear public directory
 */
gulp.task('reset', function () {
    return gulp.src('public/**', {read: false,force:true})
        .pipe(clean());
});

/**
 * Minify css
 */
gulp.task('minify-css', ['minify-js'], function () {
    return gulp.src('css/*.css')
        /** Contact all css into one css file */
        .pipe(concat('all.css'))
        /** Minify output -> file */
        .pipe(minifyCSS())
        /** Add fingerprint to output -> file*/
        .pipe(rev())
        .pipe(gulp.dest("public"))
        /** Update rev-manifest for new css file */
        .pipe(rev.manifest({'merge':true}))
        .pipe(gulp.dest("."));
});

/**
 * Minify js
 */
gulp.task('minify-js', ['reset'], function () {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest("public"))
        /** Update rev-manifest for new css file */
        .pipe(rev.manifest({merge:true}))
        .pipe(gulp.dest("."));
});

/**
 * Update index.html page with new revision urls
 */
gulp.task("index",["minify-css"], function() {
    var manifest = gulp.src("rev-manifest.json");
    return gulp.src("index.html")
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest("public"));
});

/**
 *
 */
gulp.task('compile', ['index'], function () {
    gulp.watch(['css/*.css','js/*.js'],['index']);
});