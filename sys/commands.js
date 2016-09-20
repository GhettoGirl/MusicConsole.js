/* Music Console
 * @commands.js
 *
 * Commands
 *
 */

const CmdHistory = new (require('../commands/history.js'))(global.settings.commands().history);
const CmdExit = new (require('../commands/exit.js'))(global.settings.commands().exit);

const commands = [
    CmdHistory,
    CmdExit
];

// check command list for duplicate names
var has_dups = false;
var list_size = commands.length;
for (var i = 0; i < list_size; i++)
{
    for (var j = 0; j < list_size; j++)
    {
        if (i != j && commands[i].m_name == commands[j].m_name)
        {
            has_dups = true;
        }
    }
}

// terminate program when command list has duplicates
// i will not support this behavior and the user should
// not do this in the first place anyway
if (has_dups)
{
    console.error(global.ansi.style.bold + global.termcolor.foreground.rgb(195, 0, 0)
                + "FATAL:" + global.ansi.style.reset + " "
                + "The command list has duplicates, this behavior is not supported!");
    console.error("Please fix this before you continue using this program.");
    global.process_cleanup_and_exit(2);
}

module.exports = commands;
