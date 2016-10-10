/* Music Console
 * @plistfile.js
 *
 * Command: plistfile
 * load playlist from Music Console playlist file and play it
 *
 */

const path = require('path');
const fs = require('fs');

const plistparser = require('lib/playlistparser');
const kbhit = require('lib/kbhit.node');

const tilde = require('utils/home-tilde.js');

const Command = require('sys/command.js');

function CmdPlistFile(name)
{
    Command.call(this, name);
}

CmdPlistFile.prototype = Object.create(Command.prototype);
CmdPlistFile.prototype = {

execute: function(args)
{
    if (args == global.settings.subcommands().plistlist)
    {
        for (const plist_path of global.settings.library().playlist_paths)
        {
            var dir = fs.readdirSync(plist_path);
            if (dir.length != 0)
            {
                console.log("in: " + tilde(plist_path));
                for (const i of dir)
                {
                    if (fs.statSync(path.join(plist_path, i)).isFile())
                    {
                        console.log(" × " + i.substr(0, i.length - ".plist".length));
                    }
                }
            }
        }

        return;
    }

    if (args.startsWith(global.settings.subcommands().plistview))
    {
        if (args.length == global.settings.subcommands().plistview.length)
        {
            console.error("Need a playlist file to view.");
        }

        else
        {
            for (const plist_path of global.settings.library().playlist_paths)
            {
                var results = plistparser.parse(path.join(plist_path,
                    args.substr(global.settings.subcommands().plistview.length + 1) + ".plist"));

                switch (results)
                {
                    case 0:
                        for (const i of plistparser.playlist())
                        {
                            i[0].print();
                        }

                        plistparser.clear();
                        break;

                    default:
                        plistparser.clear();
                        continue;
                        break;
                }
            }
        }

        return;
    }

    for (const plist_path of global.settings.library().playlist_paths)
    {
        var results = plistparser.parse(path.join(plist_path, args + ".plist"));

        switch (results)
        {
            case 0:
                var index = 0;
                var kbhit_normal_loop_end = false;
                while (!kbhit.kbhit())
                {
                    if (index > plistparser.playlist().length - 1)
                    {
                        kbhit_normal_loop_end = true;
                        break;
                    }

                    var player = plistparser.playlist()[index][0].type();

                    if (plistparser.playlist()[index][1] != '')
                    {
                        switch (plistparser.playlist()[index][1])
                        {
                            case 'audio':  player = MediaType.Audio; break;
                            case 'video':  player = MediaType.Video; break;
                            case 'module': player = MediaType.ModuleTracker; break;
                        }
                    }

                    mediaplayer.execute(plistparser.playlist()[index][0], player);
                    index++;
                }

                // clear input buffer if loop was canceled by the user
                if (!kbhit_normal_loop_end)
                {
                    kbhit.getchar();
                }

                plistparser.clear();
                return;
                break;

            default:
                plistparser.clear();
                continue;
                break;
        }
    }

    console.log("No valid playlist found in any of the specified paths.");
}

} // prototype

module.exports = CmdPlistFile;
