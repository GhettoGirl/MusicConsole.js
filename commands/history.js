/* Music Console
 * @history.js
 *
 * Command: history
 * prints the history on screen
 *
 */

const Command = require('../sys/command.js');

function CmdHistory(name)
{
    Command.call(this, name);
}

CmdHistory.prototype = Object.create(Command.prototype);
CmdHistory.prototype = {

execute: function(args)
{
    for (const i of global.readline.historyGet())
    {
        console.log(i);
    }
}

} // prototype

module.exports = CmdHistory;
