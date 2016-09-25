/* Music Console
 * @repeat.js
 *
 * Command: repeat
 * repeats the same media over and over again, can be stopped using kbit
 * takes type filters
 *
 */

const FilterCommand = require('sys/filtercommand.js');
const kbhit = require('lib/kbhit');

const Command = require('sys/command.js');

function CmdRepeat(name)
{
    Command.call(this, name);
}

CmdRepeat.prototype = Object.create(Command.prototype);
CmdRepeat.prototype = {

execute: function(args)
{
    var filter = FilterCommand(args);

    if (filter.command == '')
    {
        console.log("Needs a search term.");
    }

    else
    {
        var result = medialib.find(filter.command, filter.type);
        if (typeof result != "undefined")
        {
            kbhit(function()
            {
                mediaplayer.execute(result, filter.type);
            });
        }

        else
        {
            console.log("No media found.");
        }
    }
}

} // prototype

module.exports = CmdRepeat;
