/* Music Console
 * @random.js
 *
 * Command: random
 * plays a random media
 * can be filtered by type and search terms
 *
 */

const FilterCommand = require('sys/filtercommand.js');

const Command = require('sys/command.js');

function CmdRandom(name)
{
    Command.call(this, name);
}

CmdRandom.prototype = Object.create(Command.prototype);
CmdRandom.prototype = {

execute: function(args)
{
    var filter = FilterCommand(args);

    console.log("'"+filter.command+"'");
    console.log(filter.type);

    // play random media
    if (filter.command == '')
    {
        var result = medialib.randomMedia(filter.type);
        if (typeof result != "undefined")
        {
            console.log(result);
        }

        else
        {
            console.log("No media found.");
        }
    }

    // play random media file which matches the given search terms
    else
    {
        var result = medialib.randomMediaFiltered(filter.command, filter.type);
        if (typeof result != "undefined")
        {
            console.log(result);
        }

        else
        {
            console.log("No media found.");
        }
    }
}

} // prototype

module.exports = CmdRandom;
