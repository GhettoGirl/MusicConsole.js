/* Music Console
 * @clear.js
 *
 * Command: clear
 * clears all output from the terminal and prints the header again
 *
 */

const clear_terminal = require('utils/clear-terminal');

const Command = require('sys/command.js');

function CmdClear(name)
{
    Command.call(this, name);
}

CmdClear.prototype = Object.create(Command.prototype);
CmdClear.prototype = {

execute: function(args)
{
    clear_terminal();
    global.print_header();
}

} // prototype

module.exports = CmdClear;
