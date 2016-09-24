/* Music Console
 * @template.js
 *
 * Command: [template]
 * use this template to create new commands
 *
 */

const Command = require('sys/command.js');

function CmdTemplate(name)
{
    Command.call(this, name);
}

CmdTemplate.prototype = Object.create(Command.prototype);
CmdTemplate.prototype = {

execute: function(args)
{
}

} // prototype

module.exports = CmdTemplate;
