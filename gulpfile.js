/* Music Console
 * @installer.js
 *
 * { execute this file using 'gulp' }!
 *
 * Installer
 *
 *  - Minifies every JavaScript and JSON file, removes the 'devDependencies' array too
 *  - Skips every unneeded files, except LICENSES
 *  - Builds native addons
 *  - Installs node modules in production mode, excludes optimal dependencies as they are unnecessary
 *  - Copies LICENSES into their respective place
 *  - Cleans up everything after the installation is complete
 *
 *  - Installs the release in the './dist' directory
 *  - Installs a launcher script (shell)
 *
 *
 */

const path = require('path');
const combiner = require('stream-combiner2');
const del = require('del');
const exec = require('child_process').exec;

const gulp = require('gulp');
const gp_babel = require('gulp-babel');
const gp_jsonmin = require('gulp-jsonminify');
const gp_install = require('gulp-install');
const gp_jeditor = require('gulp-json-editor');
const gp_rename = require('gulp-rename');
const gp_stripcomments = require('gulp-strip-comments');

const paths = {
    scripts: [
        "main.js", "console.js",

        "sys/*.js",

        "utils/*.js",
        "utils/js-extensions/*.js",

        "extern/**/*.js",
        "!extern/**/test*.js",

        "lib/**/*.js",

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

// clean up dependencies and install only the required files, minify them too
//
//  i have an idea for a project: gulp-deps-deploy
//  which purpose is to clean up dependencies and store all files
//  which are part of the actual library into an array
//  look for nested dependencies and resolve all require() statements
//  to find all files
//  get rid of all tests, test suits, unnecessary files and READMEs and
//  documentations to reduce the size of the node_modules folder to a bare
//  minimum
/// LICENSE files will be always kept for legal purposes
//
//  the array can be used for other gulp tasks, like minifier to reduce
//  the size even more
//
//
const node_modules = {

    scripts: [
        "node_modules/call-me-maybe/*.js",

        "node_modules/charenc/*.js",
        "!node_modules/charenc/README.js",

        "node_modules/crypt/*.js",

        "node_modules/es6-promise/dist/es6-promise.js",

        "node_modules/glob-to-regexp/*.js",
        "!node_modules/glob-to-regexp/test*.js",

        "node_modules/jsonfile/*.js",

        "node_modules/node-pack/*.js",
        "!node_modules/node-pack/test*.js",

        "node_modules/readdir-enhanced/lib/**/*.js",

        "node_modules/rootpath/*.js",

        "node_modules/sequential-buffer/*.js",

        "node_modules/sha1/*.js",
        "!node_modules/sha1/test*.js"
    ],

    assets: [
        "node_modules/es6-promise/dist/es6-promise.map"
    ],

    pjsons: [
        "node_modules/rootpath/package.json",
        "node_modules/sequential-buffer/package.json",
        "node_modules/call-me-maybe/package.json",
        "node_modules/crypt/package.json",
        "node_modules/readdir-enhanced/package.json",
        "node_modules/charenc/package.json",
        "node_modules/sha1/package.json",
        "node_modules/glob-to-regexp/package.json",
        "node_modules/node-pack/package.json",
        "node_modules/jsonfile/package.json",
        "node_modules/es6-promise/package.json"
    ],

    licenses: [
        "node_modules/call-me-maybe/LICENSE*",
        "node_modules/charenc/LICENSE*",
        "node_modules/crypt/LICENSE*",
        "node_modules/es6-promise/LICENSE*",
        "node_modules/glob-to-regexp/LICENSE*",
        "node_modules/jsonfile/LICENSE*",
        "node_modules/node-pack/LICENSE*",
        "node_modules/readdir-enhanced/LICENSE*",
        "node_modules/rootpath/LICENSE*",
        "node_modules/sequential-buffer/LICENSE*",
        "node_modules/sha1/LICENSE*"
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
        gulp.src(paths.scripts.concat(node_modules.scripts), {base: '.'}),
        gp_stripcomments(),
        gp_babel({presets: ['babili']}),
        gulp.dest("./dist")
    ]);

    combined.on('error', console.error.bind(console));

    return combined;
});

// minify package.json's and install them
gulp.task('pjsons', ['clean'/*, 'install-modules'*/], function()
{
    var combined = combiner.obj([
        gulp.src(paths.pjsons.concat(node_modules.pjsons), {base: '.'}),
        gp_jeditor(function(json)
        {
            //delete json.devDependencies;

            return {
                name: json.name,
                display_name: json.display_name,
                version: json.version,
                revision: json.revision,
                author: json.author,
                license: json.license,
                homepage: json.homepage,
                main: json.main,
                dependencies: json.dependencies
            };
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
        gulp.src(paths.licenses.concat(node_modules.licenses), {base: '.'}),
        gulp.dest("./dist")
    ]);

    combined.on('error', console.error.bind(console));

    return combined;
});

gulp.task('assets', ['clean'], function()
{
    var combined = combiner.obj([
        gulp.src(node_modules.assets, {base: '.'}),
        gulp.dest("./dist")
    ]);

    combined.on('error', console.error.bind(console));

    return combined;
});

// install nodule modules (production)
/*gulp.task('install-modules', ['clean'], function()
{
    gulp.src('./package.json')
        .pipe(gulp.dest("./dist"))
        .pipe(gp_install({
            production: true,
            noOptional: true
        }));
});*/

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
    //'install-modules',
    'launcher-script',
    'scripts',
    'assets',
    'pjsons',
    'licenses',
    'native-build',
    'native-install',
    'native-clear'
]);
