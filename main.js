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
global.process_register_signal_handlers();

// javascript extensions
global.jsext = require('utils/js-extensions');

// global objects
global.pjson = require(__dirname + "/package.json");
global.pkg_version = new (require('./version.js'));

// terminal formatting
const termformat = require('utils/termformat.js');

// print application header to terminal
global.print_header = function()
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
        header += termformat.ansi.reset + "┌" + line + "┐\n";

        // second line
        header += "│ "
               + termformat.ansi.bold + pjson.display_name + termformat.ansi.reset
               + " " + pkg_version.version();

        for (let i = 2 + pjson.display_name.length
                       + pkg_version.version().length; i < cols; i++)
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
        header += termformat.ansi.reset
               + termformat.ansi.bold + pjson.display_name + termformat.ansi.reset
               + " " + pkg_version.version() + "\n";
    }

    console.log(header);
}

function cmd_notice()
{
    var cols = process.stdout.columns;
    var notice = "";

    const notice_text = termformat.ansi.bold + "ＮＯＴＩＣＥ" + termformat.ansi.reset;
    const notice_text_len = 12 + 7; // wide-chars needs 2 columns in the terminal
    const notice_msg = [
        "Starting the app with options just changes settings and quits it afterwards.",
        "To use it start it either without arguments to enter the console or just specify",
        "a simple search term."
    ];

    if (cols != 0)
    {
        notice = "┌──[" + notice_text + "]─";
        for (let i = 0; i < cols - notice_text_len; i++)
        {
            notice += "─";
        }

        notice += "┐\n";

        for (const i of notice_msg)
        {
            notice += "│ " + i;
            for (let j = i.length + 3; j < cols; j++)
            {
                notice += " ";
            }

            notice += "│\n";
        }

        notice += "└";
        for (let i = 0; i < cols - 2; i++)
        {
            notice += "─";
        }
        notice += "┘\n";
    }

    else
    {
        notice = notice_text + "\n";
        for (const i of notice_msg)
        {
            notice += "│ " + i + "\n";
        }
    }

    return notice;
}

const startup_mode = {
    normal: 0,
    command: 1,
    options: 2
};

function parse_arguments()
{
    // fixme: change the command line parsing library someday...
    //        or write my own :)
    const opt = require('extern/node-getopt').create([
        ['',  "library-path=path",   "Changes the path of the media library"],
        ['',  "command=args",        "Changes the name of commands"],
        ['h', "help",                "Display this help"]
    ])
    .error(function(error)
    {
        // better and more informative error messages
        //  error.message can has the following
        //   - invalid option {}
        //   - option {} need argument

        var option = (function(msg)
        {
            var m;

            m = msg.match(RegExp("invalid\\soption\\s(.*)", 'i'));
            if (m) return m[1];

            m = msg.match(RegExp("option\\s(.*)\\sneed\\sargument", 'i'));
            if (m) return m[1];

            return "";
        })(error.message);

        if (error.message.match(RegExp("invalid\\soption\\s.*", 'i')))
        {
            console.error("Invalid option: " + option);
        }

        else if (error.message.match(RegExp("option\\s.*\\sneed\\sargument", 'i')))
        {
            switch (option)
            {
                case "library-path":
                    console.error("--library-path: You need to specify a valid path.");
                    break;

                default:
                    console.error("Option '%s' needs an argument!", option);
                    break;
            }
        }

        global.process_cleanup_and_exit(1);
    })
    .bindHelp()
    .setHelp(
        "Usage: " + termformat.ansi.bold + "music " + termformat.ansi.reset
                  + "\"command\" or " + termformat.ansi.italic + "{options}"
                  + termformat.ansi.reset + "\n\n" +

        "[[OPTIONS]]\n\n\n" +

        // command guide
        " " + termformat.ansi.bold + "《Commands》" + termformat.ansi.reset +
        "  --command=[command=(new name)],...\n\n" +

        "   audio,video,module,search,browse,random,shuffle,repeat\n" +
        "   history,statistics,rescan,playlist,plistfile,clear,exit\n" +

        "\n" +
        " Examples:\n\n" +
        "   audio=a               Changes the command 'audio' to 'a'\n" +
        "   module=mod,audio=a    Changes the command 'module' to 'mod' and 'audio' to 'a'\n" +
        "   module=mod,audio=     Changes the command 'module' to 'mod' and disables the 'audio' command\n" +

        // final notice
        "\n\n" + cmd_notice()
    )
    .parseSystem();

    // got options
    if (Object.keys(opt.options).length != 0)
    {
        return {
            mode: startup_mode.options,
            args: opt.options
        };
    }

    // got command
    else if (opt.argv.length != 0)
    {
        return {
            mode: startup_mode.command,
            args: opt.argv.join(' ')
        };
    }

    // normal startup
    else
    {
        return {
            mode: startup_mode.normal,
            args: undefined
        };
    }
}

function init_medialib()
{
    const MediaLibraryModel = require('lib/medialibrarymodel');
    global.MediaType = MediaLibraryModel.MediaType;
    global.medialib = new MediaLibraryModel.MediaLibraryModel();

    if (!medialib.setPath(settings.library().rootpath))
    {
        console.error("Unable to read from the specified path: " + settings.library().rootpath);
        global.process_cleanup_and_exit(3);
    }

    // should not throw due to the previous check
    process.chdir(medialib.path());

    medialib.setCachePath(settings.directory() + "/cache");

    medialib.setMediaTypes(MediaType.Audio, settings.library().audioformats);
    medialib.setMediaTypes(MediaType.Video, settings.library().videoformats);
    medialib.setMediaTypes(MediaType.ModuleTracker, settings.library().moduleformats);

    medialib.setPrefixDeletionPatterns(settings.library().prefixdeletionpatterns);

    medialib.setRandomizerHistorySize(settings.randomizer().historysize);

    // \x1b[1A move cursor one line up
    // \x1b[nD move cursor n columns to the left
    // \x1b[K  clear to the end of line
    var msg_plswait = "Scanning, please wait...";
    console.log(msg_plswait);

    if (!medialib.scan())
    {
        process.stdout.write('\x1b[1A\x1b[' + msg_plswait.length + 'D\x1b[K');
        console.error("Unable to scan the specified path: " + settings.library().rootpath);
        global.process_cleanup_and_exit(3);
    }

    process.stdout.write('\x1b[1A\x1b[' + msg_plswait.length + 'D\x1b[K');

    if (medialib.count() == 0)
    {
        console.log("Notice: No media found in the specified path: " + settings.library().rootpath);
        console.log("There is nothing to do, exiting...");
        global.process_cleanup_and_exit(4);
    }
}

function init_mediaplayercontroller()
{
    global.mediaplayer = new (require('lib/mediaplayercontroller'));

    // set default players
    mediaplayer.setPlayerForMediatype(MediaType.Audio, settings.player().audioplayer);
    mediaplayer.setPlayerForMediatype(MediaType.Video, settings.player().videoplayer);
    mediaplayer.setPlayerForMediatype(MediaType.ModuleTracker, settings.player().modplayer);

    // set player overrides per filetype
    for (const type of medialib.mediaTypes(MediaType.None))
    {
        mediaplayer.setPlayerForFiletype(type, settings.findPlayerForFiletype(type));
    }
}

function main()
{
    print_header();

    // initialize components
    global.settings = new (require('sys/settings.js'));
    global.musicconsole = new (require('./console.js'));

    // parse command line arguments
    var opt = parse_arguments();

    // do this things only when starting up normally
    // i makes no sense while changing settings from the command line
    if (opt.mode != startup_mode.options)
    {
        global.settings.resolveEnvVariables();
        init_medialib();
        init_mediaplayercontroller();
    }

    switch (opt.mode)
    {
        case startup_mode.normal:
            musicconsole.console();
            break;

        case startup_mode.command:
            musicconsole.runCommand(opt.args);
            break;

        case startup_mode.options:
            global.settings.manager(opt.args);
            break;
    }
}

main();
