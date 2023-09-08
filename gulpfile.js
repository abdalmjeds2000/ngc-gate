'use strict';

const build = require('@microsoft/sp-build-web');

const gulp = require('gulp');



build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};


  var gulpless = require('gulp-less');
  var gulpautoprefixer = require('gulp-autoprefixer');

  // gulp.task('styles',function(){
  //   var srcfile = './src/webparts/ngcGate/components/custom-theme.less';
  //   var temp = './.tmp';
  //     return gulp
  //       .src(srcfile)
  //       .pipe(gulpless())
  //       .pipe(gulpautoprefixer())
  //       .pipe(gulp.dest(temp));
  // });

  // Enable inline javascript in LESS for gulp.task "styles"
  gulp.task('styles',function(){
    var srcfile = './src/webparts/ngcGate/components/customize-antd-theme/custom-theme.less';
    var temp = './src/webparts/ngcGate/components/customize-antd-theme';
      return gulp
        .src(srcfile)
        .pipe(gulpless({
          javascriptEnabled: true
        }))
        .pipe(gulpautoprefixer())
        .pipe(gulp.dest(temp));
  }
  );


build.initialize(gulp);
