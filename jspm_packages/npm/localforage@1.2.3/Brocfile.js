/* */ 
var env = require('broccoli-env').getEnv();
var findBowerTrees = require('broccoli-bower');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var uglifyJavaScript = require('broccoli-uglify-js');

var app = '';
app = pickFiles(app, {
    srcDir: '/src',
    destDir: '/dist'
});

// var tests = 'tests'
// tests = pickFiles(tests, {
//     srcDir: '/',
//     destDir: 'appkit/tests'
// })
// tests = preprocess(tests)

// var vendor = 'vendor'

// var appAndDependencies = new mergeTrees(sourceTrees, { overwrite: true })

// var appJs = compileES6(appAndDependencies, {
//     loaderFile: 'loader.js',
//     ignoredModules: [
//         'ember/resolver'
//     ],
//     inputFiles: [
//         'appkit/**/*.js'
//     ],
//     legacyFilesToAppend: [
//         'jquery.js',
//         'handlebars.js',
//         'ember.js',
//         'ember-data.js',
//         'ember-resolver.js'
//     ],
//     wrapInEval: env !== 'production',
//     outputFile: '/assets/app.js'
// })

// if (env === 'production') {
//     appJs = uglifyJavaScript(appJs, {
//         // mangle: false,
//         // compress: false
//     })
// }

// var publicFiles = 'public'

// module.exports = mergeTrees([appJs, appCss, publicFiles])
