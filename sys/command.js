/* Music Console
 * @command.js
 *
 * Command template class
 *
 */

function Command(name)
{
    this.m_name = name.toLowerCase();
}

Command.prototype = {

execute: function(args)
{
    console.log("Command: warning: you should not use this class directly");
}

} // prototype

module.exports = Command;
