/* Music Console
 * @installer.js
 *
 * { execute this file using 'gulp' }!
 *
 * Installer
 *
 *  - (Runs tests) - at the moment there aren't any
 *  - Minifies every JavaScript and JSON file, removes the 'devDependencies' array too
 *  - Skips every unneeded files, except LICENSES
 *  - Builds native addons
 *  - Installs node modules in production mode
 *  - Copies LICENSES into their respective place
 *  - Cleans up everything after the installation
 *
 *  - Installs the release in the './dist' directory
 *  - Installs a launcher script (shell)
 *
 * TODO:
 *  - write tests
 *
 *  - FIND BETTER JS MINIFIER
 *    |- trim comments from JavaScript files
 *
 *
 */

const path = require('path');
const gulp = require('gulp');
const gp_concat = require('gulp-concat');
const gp_babel = require('gulp-babel');
const gp_jsonmin = require('gulp-jsonminify');
const gp_sourcemaps = require('gulp-sourcemaps');
const gp_install = require('gulp-install');
const gp_jeditor = require('gulp-json-editor');
const gp_rename = require('gulp-rename');
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
    licenses: [
        "LICENSE",
        "extern/**/LICENSE"
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

// install launcher script
gulp.task('launcher-script', ['clean'], function()
{
    var combined = combiner.obj([
        gulp.src("./music.sh", {base: '.'}),
        gp_rename("music"),
        gulp.dest("./dist")
    ]);

    combined.on('error', console.error.bind(console));

    return combined;
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
gulp.task('pjsons', ['clean', 'install-modules'], function()
{
    var combined = combiner.obj([
        gulp.src(paths.pjsons, {base: '.'}),
        gp_jeditor(function(json)
        {
            delete json.devDependencies;
            return json;
        }),
        gp_jsonmin(),
        gulp.dest("./dist")
    ]);

    combined.on('error', console.error.bind(console));

    return combined;
});

// install licenses
gulp.task('licenses', ['clean'], function()
{
    var combined = combiner.obj([
        gulp.src(paths.licenses, {base: '.'}),
        gulp.dest("./dist")
    ]);

    combined.on('error', console.error.bind(console));

    return combined;
});

// install nodule modules (production)
gulp.task('install-modules', ['clean'], function()
{
    gulp.src('./package.json')
        .pipe(gulp.dest("./dist"))
        .pipe(gp_install({
            production: true,
            noOptional: true
        }));
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

// clear native build dir
gulp.task('native-clear', ['clean', 'native-install'], function()
{
    return del(["./build/**"]);
});

gulp.task('default', [
    'clean',
    'install-modules',
    'launcher-script',
    'scripts',
    'pjsons',
    'licenses',
    'native-build',
    'native-install',
    'native-clear'
]);
