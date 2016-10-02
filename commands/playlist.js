/* Music Console
 * @playlist.js
 *
 * Command: playlist
 * generates a playlist using a search term and plays it
 * can be canceled at any time using kbit
 * takes type filters
 *
 */

const FilterCommand = require('sys/filtercommand.js');
const kbhit = require('lib/kbhit.node');

const Command = require('sys/command.js');

function CmdPlaylist(name)
{
    Command.call(this, name);
}

CmdPlaylist.prototype = Object.create(Command.prototype);
CmdPlaylist.prototype = {

execute: function(args)
{
    var filter = FilterCommand(args);

    if (filter.command == '')
    {
        console.log("Needs a search term.");
    }

    else
    {
        var result = medialib.findMultiple(filter.command, filter.type);
        var index = 0;

        if (result.length != 0)
        {
            var kbhit_normal_loop_end = false;
            while (!kbhit.kbhit())
            {
                if (index > result.length - 1)
                {
                    kbhit_normal_loop_end = true;
                    break;
                }

                medialib.setLastResult(result[index]);
                mediaplayer.execute(result[index], filter.type);
                index++;
            }

            // clear input buffer if loop was canceled by the user
            if (!kbhit_normal_loop_end)
            {
                kbhit.getchar();
            }
        }

        else
        {
            console.log("No media found.");
        }
    }
}

} // prototype

module.exports = CmdPlaylist;
