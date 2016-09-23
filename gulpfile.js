/* Music Console
 * @installer.js
 *
 * { execute this file using 'gulp' }!
 *
 * Installer
 *
 *  - (Runs tests) - at the moment there aren't any
 *  - Minifies every JavaScript and JSON file
 *  - Skips every unneeded files, except LICENSES
 *
 *  - Installs the release in the './dist' directory
 *
 * TODO:
 *  - write tests
 *
 *  - install required node_modules
 *  - preserve directory structure
 *  - include minified package.json files
 *  - include LICENSE files
 *  - rebuild native addons (node-gyp)
 *  - install native addons
 *  - clean up after install
 *
 *
 */

const gulp = require('gulp');
const gp_concat = require('gulp-concat');
const gp_babel = require('gulp-babel');
const gp_jsonmin = require('gulp-jsonminify');
const gp_sourcemaps = require('gulp-sourcemaps');
const combiner = require('stream-combiner2');
const del = require('del');

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
        "lib/searchtermgen/*.js"
    ]
};

gulp.task('clean', function()
{
    return del(["build", "dist"]);
});

gulp.task('scripts', ['clean'], function()
{
    var combined = combiner.obj([
        gulp.src(paths.scripts),
        //.pipe(gp_sourcemaps.init())
        gp_babel({presets: ['babili']}),
        //.pipe(gp_concat('app.js'))
        //.pipe(gp_sourcemaps.write())
        gulp.dest('./dist')
    ]);

    combined.on('error', console.error.bind(console));

    return combined;
});

gulp.task('default', ['scripts']);
