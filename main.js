/* Music Console
 * @main.js
 *
 * App Launcher
 *
 */

// global objects
global.pjson = require(__dirname + "/package.json");
global.ansi = require('ansi-escape-sequences');

var SettingsManager = require('./settings.js');
global.settings = new SettingsManager();

var MusicConsole = require('./console.js');
global.musicconsole = new MusicConsole();

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
        for (var i = 0; i < cols; i++)
        {
            line += "─";
        }

        // first line
        header += ansi.style.reset + "┌" + line + "┐\n";

        // second line
        header += "│ " + ansi.style.bold +
                  pjson.display_name + ansi.style.reset + " " +
                  pjson.version + "-" + pjson.revision;

        for (var i = 3 + pjson.display_name.length
                       + pjson.version.length
                       + pjson.revision.length; i < cols; i++)
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
        header += ansi.style.reset + ansi.style.bold +
                  pjson.display_name + ansi.style.reset + " " +
                  pjson.version + "-" + pjson.revision + "\n";
    }

    console.log(header);

    delete cols;
    delete line;
    delete header;
}

// ensure only a single instance of this application is running
function singleinstance_check()
{
    pidlock.guard('/tmp', pjson.name + '_singleton.lock', function(error, data, cleanup)
    {
        if (error)
        {
            console.log(ansi.style.bold + '\033[38;2;166;74;0m' +
                        "NOTICE:" + ansi.style.reset + " " + ansi.style.italic +
                        "only one instance is allowed!" + ansi.style.reset);
            process.exit(5);
        }
    });
}

function main()
{
    print_header();
    singleinstance_check();

    musicconsole.main();
}

main();
