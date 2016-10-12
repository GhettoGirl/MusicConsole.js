/* Music Console
 * @favorite.js
 *
 * Command: favorite
 * manages favorites
 *
 */

const Command = require('sys/command.js');

function CmdFavorite(name)
{
    Command.call(this, name);
}

CmdFavorite.prototype = Object.create(Command.prototype);
CmdFavorite.prototype = {

execute: function(args)
{
}

} // prototype

module.exports = CmdFavorite;
