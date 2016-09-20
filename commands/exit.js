/* Music Console
 * @exit.js
 *
 * Command: exit
 * (self explaining)
 *
 */

const Command = require('../sys/command.js');

function CmdExit(name)
{
    Command.call(this, name);
}

CmdExit.prototype = Object.create(Command.prototype);
CmdExit.prototype = {

execute: function(args)
{
    global.process_cleanup_and_exit();
}

} // prototype

module.exports = CmdExit;
