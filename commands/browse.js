/* Music Console
 * @browse.js
 *
 * Command: browse
 * invokes an external program (file browser) in the
 * media libraries root path
 *
 */

const exec = require('child_process').spawnSync;

const Command = require('sys/command.js');

function CmdBrowse(name)
{
    Command.call(this, name);
}

CmdBrowse.prototype = Object.create(Command.prototype);
CmdBrowse.prototype = {

execute: function(args)
{
    // Replace %d in argument list or append location if not existent
    var args = global.settings.tools().browser.arguments;
    var d_index = args.indexOf('%d');
    if (d_index != -1)
    {
        args[d_index] = medialib.path();
    }

    else
    {
        args.push(medialib.path());
    }

    exec(global.settings.tools().browser.command, args, {stdio: 'inherit'});
}

} // prototype

module.exports = CmdBrowse;
