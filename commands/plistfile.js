/* Music Console
 * @plistfile.js
 *
 * Command: plistfile
 * load playlist from Music Console playlist file and play it
 *
 */

const path = require('path');

const plistparser = require('lib/playlistparser');
const kbhit = require('lib/kbhit.node');

const Command = require('sys/command.js');

function CmdPlistFile(name)
{
    Command.call(this, name);
}

CmdPlistFile.prototype = Object.create(Command.prototype);
CmdPlistFile.prototype = {

execute: function(args)
{
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

            case 1:
                plistparser.clear();
                continue;
                break;

            case 2:
                plistparser.clear();
                continue;
                break;
        }
    }

    console.log("No valid playlist found in any of the specified paths.");
}

} // prototype

module.exports = CmdPlistFile;
