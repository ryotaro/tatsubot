"use strict"

const gulp = require('gulp');
const gulpTSC = require('gulp-typescript');

gulp.task('build', () => {
    const tsProject = gulpTSC.createProject('./tsconfig.json');
    const tsResult = tsProject.src().pipe(
        gulpTSC(tsProject)
    );
    return tsResult.js.pipe(gulp.dest('./scripts'));
});

gulp.task('watch', ['build'], () => {
    return gulp.watch('./src/**/*.ts', ['build']);
})