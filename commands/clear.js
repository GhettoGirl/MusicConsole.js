/* Music Console
 * @clear.js
 *
 * Command: clear
 * clears all output from the terminal and prints the header again
 *
 */

const termformat = require('utils/termformat.js');

const Command = require('sys/command.js');

function CmdClear(name)
{
    Command.call(this, name);
}

CmdClear.prototype = Object.create(Command.prototype);
CmdClear.prototype = {

execute: function(args)
{
    termformat.clear();
    global.print_header();
}

} // prototype

module.exports = CmdClear;
