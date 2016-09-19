"use strict"

const gulp = require('gulp');
const gulpTSC = require('gulp-typescript');
const gulpMocha = require('gulp-mocha');
const gutil = require('gulp-util');
const {spawn} = require('child_process');
const path = require('path');

gulp.task('build', () => {
    const tsProject = gulpTSC.createProject('./tsconfig.json');
    const tsResult = tsProject.src().pipe(
        gulpTSC(tsProject)
    );
    return tsResult.js.pipe(gulp.dest('./scripts'));
});

gulp.task('watch', ['build'], () => {
    return gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('test', ['build'], () => {
    return gulp.src('./scripts/test/**/*.js')
        .pipe(gulpMocha({
            reporter: 'list'
        }))
        .on('error', gutil.log);
});