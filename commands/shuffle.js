/* Music Console
 * @shuffle.js
 *
 * Command: shuffle
 * shuffle through your library infinitely, can be stopped using kbit
 * takes a search term and type filter
 *
 */

const FilterCommand = require('sys/filtercommand.js');
const kbhit = require('lib/kbhit');

const Command = require('sys/command.js');

function CmdShuffle(name)
{
    Command.call(this, name);
}

CmdShuffle.prototype = Object.create(Command.prototype);
CmdShuffle.prototype = {

execute: function(args)
{
    var filter = FilterCommand(args);

    // shuffles random media files
    if (filter.command == '' && filter.type == MediaType.None)
    {
        if (medialib.count(filter.type) != 0)
        {
            kbhit(function()
            {
                mediaplayer.execute(medialib.randomMedia(filter.type), filter.type);
            });
        }

        else
        {
            console.log("No media found.");
        }
    }

    // shuffles random media filse which matches the given search terms
    else
    {
        if (filter.command == '')
        {
            if (medialib.count(filter.type) != 0)
            {
                kbhit(function()
                {
                    mediaplayer.execute(medialib.randomMedia(filter.type), filter.type);
                });
            }

            else
            {
                console.log("No media found.");
            }
        }

        else if (filter.command != '')
        {
            var results = medialib.findMultiple(filter.command, filter.type);
            if (typeof results != 0)
            {
                kbhit(function()
                {
                    var mediafile = results[medialib.m_randomizer.random(0, results.length - 1)];
                    medialib.setLastResult(mediafile);
                    mediaplayer.execute(mediafile, filter.type);
                });
            }

            else
            {
                console.log("No media found.");
            }
        }
    }
}

} // prototype

module.exports = CmdShuffle;
