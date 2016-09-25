/* Music Console
 * @module.js
 *
 * Command: module
 * filter by module files, play in module player
 *
 */

const Command = require('sys/command.js');

function CmdModule(name)
{
    Command.call(this, name);
}

CmdModule.prototype = Object.create(Command.prototype);
CmdModule.prototype = {

execute: function(args)
{
    var result = medialib.find(args, MediaType.ModuleTracker);
    if (typeof result != "undefined")
    {
        mediaplayer.execute(result);
    }

    else
    {
        console.log("No media found.");
    }
}

} // prototype

module.exports = CmdModule;
