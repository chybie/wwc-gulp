// DEPENDENT PLUGINS =========================/
var gulp = require('gulp'),
  connect = require('gulp-connect'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),
  coffee = require('gulp-coffee'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  image = require('gulp-image');

var srcFiles = {
  jade: 'build/views/**/*.jade',
  sass: 'build/sass/**/*.sass',
  coffee: 'build/coffee/*.coffee',
  image: 'build/images/*.{png,jpg,gif,svg}'
};

var distDir = {
  base: 'connect',
  css: 'connect/css',
  js: 'connect/js',
  image: 'connect/images'
};

// TASK & CONFIGURATION =============================/

//Convert Jade to Html
gulp.task('jade',function(){
  gulp.src(srcFiles.jade)
  .pipe(jade({
    pretty: true
  }))
  .pipe(gulp.dest(distDir.base))
  .pipe(connect.reload());
});

//Start server
gulp.task('connect', function(){
  connect.server({
    root: distDir.base,
    livereload: true
  })
});

//Convert Sass to Css and Minify it
gulp.task('sass', function(){
  gulp.src(srcFiles.sass)
  //Convert
  .pipe(sass())
  .pipe(gulp.dest(distDir.css))
  //Minify
  .pipe(cssmin())
  .pipe(rename({suffix:'.min'}))
  .pipe(gulp.dest(distDir.css))
  .pipe(connect.reload());;
});

//Convert Coffeescript to Js, Lint it and Uglify it
gulp.task('coffee', function(){
  gulp.src(srcFiles.coffee)
  //Convert
  .pipe(coffee({bare:true}))
  .pipe(gulp.dest(distDir.js))
  //Lint
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  //Uglify
  .pipe(uglify())
  .pipe(rename({suffix:'.min'}))
  .pipe(gulp.dest(distDir.js))
  .pipe(connect.reload());
});

//Compress images
gulp.task('image', function(){
  gulp.src(srcFiles.image)
  .pipe(image())
  .pipe(gulp.dest(distDir.image))
});

//Supervise
gulp.task('watch', function(){
  gulp.watch(srcFiles.jade,['jade']);
  gulp.watch(srcFiles.sass,['sass']);
  gulp.watch(srcFiles.coffee,['coffee']);
});

// COMBINED TASKS =========================/
//Deployment
gulp.task('deploy',['jade', 'sass', 'coffee', 'image']);

//Default
gulp.task('default',['connect', 'watch']);
