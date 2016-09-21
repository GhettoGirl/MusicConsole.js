/* Music Console
 * @exit.js
 *
 * Command: rescan
 * Rescans the filesystem and re-builds the media library
 * without restarting the app.
 * Makes use of cached data if exists.
 *
 */

const Command = require('../sys/command.js');

function CmdRescan(name)
{
    Command.call(this, name);
}

CmdRescan.prototype = Object.create(Command.prototype);
CmdRescan.prototype = {

execute: function(args)
{
    if (!global.medialib.rescan())
    {
        console.error("MediaLibraryModel: rescan failed!");
    }
}

} // prototype

module.exports = CmdRescan;
