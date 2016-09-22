/* Music Console
 * @main.js
 *
 * App Launcher
 *
 */

// add root path to require()
require('rootpath')();

// install signal handler
require('sys/signalhandler.js');

// javascript extensions
global.jsext = require('utils/js-extensions');

// global objects
global.pjson = require(__dirname + "/package.json");
global.ansi = require('ansi-escape-sequences');
global.termcolor = require('utils/termcolor.js');
global.pkg_version = new (require('extern/NodeSwVersionParser'));

global.mkdirp = require('extern/node-mkdirp');

// local objects
var pidlock = require('pidlock');

// print application header to terminal
function print_header()
{
    var cols = process.stdout.columns;
    var line = "", header = "";

    // generate nice header with separator line across terminal window
    if (cols != 0)
    {
        cols -= 2;

        // generate base line
        for (let i = 0; i < cols; i++)
        {
            line += "─";
        }

        // first line
        header += ansi.style.reset + "┌" + line + "┐\n";

        // second line
        header += "│ "
               + ansi.style.bold + pjson.display_name + ansi.style.reset
               + " " + global.pkg_version.version();

        for (let i = 2 + pjson.display_name.length
                       + global.pkg_version.version().length; i < cols; i++)
        {
            header += " ";
        }

        header += "│\n";

        // last line
        header += "└" + line + "┘\n";
    }

    // generate normal header, when terminal size cannot be determined
    else
    {
        header += ansi.style.reset
               + ansi.style.bold + pjson.display_name + ansi.style.reset
               + " " + global.pkg_version.version() + "\n";
    }

    console.log(header);
}

// ensure only a single instance of this application is running
function singleinstance_check()
{
    pidlock.guard('/tmp', pjson.name + '_singleton.lock', function(error, data, cleanup)
    {
        if (error)
        {
            console.log(ansi.style.bold + termcolor.foreground.rgb(166, 74, 0) +
                        "NOTICE:" + ansi.style.reset + " " + ansi.style.italic +
                        "only one instance is allowed!" + ansi.style.reset);
            global.process_cleanup_and_exit(5);
        }
    });
}

function init_medialib()
{
    const MediaLibraryModel = require('./lib/medialibrarymodel');
    global.MediaType = MediaLibraryModel.MediaType;
    global.medialib = new MediaLibraryModel.MediaLibraryModel();

    if (!medialib.setPath(settings.library().rootpath))
    {
        console.error("Unable to read from the specific path: " + settings.library().rootpath);
        console.error("There is nothing to do, exiting...");
        global.process_cleanup_and_exit(3);
    }

    medialib.setCachePath(settings.directory() + "/cache");

    medialib.setMediaTypes(MediaType.Audio, settings.library().audioformats);
    medialib.setMediaTypes(MediaType.Video, settings.library().videoformats);
    medialib.setMediaTypes(MediaType.ModuleTracker, settings.library().moduleformats);

    medialib.setPrefixDeletionPatterns(settings.library().prefixdeletionpatterns);

    medialib.setRandomizerHistorySize(settings.randomizer().historysize);
}

function main()
{
    print_header();
    singleinstance_check();

    // initialize components
    global.settings = new (require('./sys/settings.js'));
    global.musicconsole = new (require('./console.js'));

    init_medialib();

    musicconsole.main();
}

main();
