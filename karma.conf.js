// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    files: [
      'bower_components/angular/angular.js', // angular
      'bower_components/angular-mocks/angular-mocks.js', // angular mocks
      'bower_components/raven-js/dist/raven.js',
      'bower_components/raven-js/dist/plugins/angular.js',
      'src/js/app.js',
      'src/js/directives/svgIcon/svgIcon.directive.js',
      'src/js/directives/svgIcon/svgIcon.spec.js',
      'public/views/**/*.html',
    ],

    exclude: [
      'src/js/translations.js',
      'src/js/version.js',
      'test/karma.conf.js',
      'test/old/*',
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
