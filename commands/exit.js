/* Music Console
 * @exit.js
 *
 * Command: exit
 * (self explaining)
 *
 */

const termformat = require('utils/termformat.js');

const Command = require('sys/command.js');

function CmdExit(name)
{
    Command.call(this, name);

    // disallow the exit command to be disabled
    if (name.trim() == '')
    {
        console.error(termformat.ansi.bold + termformat.foreground.rgb(195, 0, 0)
            + "FATAL:" + termformat.ansi.reset + " "
            + "You are not allowed to disable the 'exit' command!");
        global.process_cleanup_and_exit(2);
    }
}

CmdExit.prototype = Object.create(Command.prototype);
CmdExit.prototype = {

execute: function(args)
{
    global.process_cleanup_and_exit();
}

} // prototype

module.exports = CmdExit;
