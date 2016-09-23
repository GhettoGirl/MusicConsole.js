/* Music Console
 * @installer.js
 *
 * { execute this file using 'gulp' }!
 *
 * Installer
 *
 *  - (Runs tests) - at the moment there aren't any
 *  - Minifies every JavaScript and JSON file
 *      todo: remove devDependencies from all package.json files
 *  - Skips every unneeded files, except LICENSES
 *  - Builds native addons
 *
 *  - Installs the release in the './dist' directory
 *
 * TODO:
 *  - write tests
 *
 *  - install required node_modules
 *  - include LICENSE files
 *  - clean up after install
 *
 *
 */

const path = require('path');
const gulp = require('gulp');
const gp_concat = require('gulp-concat');
const gp_babel = require('gulp-babel');
const gp_jsonmin = require('gulp-jsonminify');
const gp_sourcemaps = require('gulp-sourcemaps');
const combiner = require('stream-combiner2');
const del = require('del');
const exec = require('child_process').exec;

const paths = {
    scripts: [
        "main.js", "console.js",

        "sys/*.js",

        "utils/*.js",
        "utils/js-extensions/*.js",

        "extern/**/*.js",

        "lib/kbhit/*.js",
        "lib/medialibrarymodel/*.js",
        "lib/mediaplayercontroller/*.js",
        "lib/searchtermgen/*.js",

        "commands/*.js",
        "!commands/template.js"
    ],
    pjsons: [
        "package.json",
        "lib/**/package.json",
        "utils/js-extensions/package.json",
        "extern/**/package.json"
    ],
    native_modules: [
        "lib/*.node"
    ]
};

// clean old build
gulp.task('clean', function()
{
    return del(["./build/**", "./dist/**"]);
});

// minify scripts and install them
gulp.task('scripts', ['clean'], function()
{
    var combined = combiner.obj([
        gulp.src(paths.scripts, {base: '.'}),
        //.pipe(gp_sourcemaps.init())
        gp_babel({presets: ['babili']}),
        //.pipe(gp_concat('app.js'))
        //.pipe(gp_sourcemaps.write())
        gulp.dest("./dist")
    ]);

    combined.on('error', console.error.bind(console));

    return combined;
});

// minify package.json's and install them
gulp.task('pjsons', ['clean'], function()
{
    var combined = combiner.obj([
        gulp.src(paths.pjsons, {base: '.'}),
        gp_jsonmin(),
        gulp.dest("./dist")
    ]);

    combined.on('error', console.error.bind(console));

    return combined;
});

// (re)-builds native addons
gulp.task('native-build', ['clean'], function(cb)
{
    exec('node-gyp rebuild', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// installs native addons
gulp.task('native-install', ['clean', 'native-build'], function()
{
    var combined = combiner.obj([
        gulp.src(paths.native_modules, {base: '.'}),
        gulp.dest("./dist")
    ]);

    combined.on('error', console.error.bind(console));

    return combined;
});

gulp.task('default', ['clean', 'scripts', 'pjsons', 'native-build', 'native-install']);
