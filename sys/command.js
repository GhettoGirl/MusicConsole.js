/* Music Console
 * @command.js
 *
 * Command template class
 *
 */

const simplifystring = require('utils/simplifystring.js');

function Command(name)
{
    this.m_name = simplifystring(name.toLowerCase());

    // spaces are not allowed in command names
    this.m_name.indexOf(' ') != -1 ? this.m_valid = false : this.m_valid = true;
}

Command.prototype = {

execute: function(args)
{
    console.error("Command: warning: you should not use this class directly");
}

} // prototype

module.exports = Command;
