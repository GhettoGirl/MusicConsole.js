/* Music Console
 * @commands.js
 *
 * Commands
 *
 */

const n_cmd = global.settings.commands();

function cmd(name)
{
    return "../commands/" + name + ".js";
}

const commands = [
    new (require(cmd("history")))     (n_cmd.history),
    new (require(cmd("statistics")))  (n_cmd.statistics),
    new (require(cmd("rescan")))      (n_cmd.rescan),
    new (require(cmd("exit")))        (n_cmd.exit)
];

// check command list for duplicate names
for (let i = 0; i < commands.length; i++)
{
    for (let j = 0; j < commands.length; j++)
    {
        if (i != j && commands[i].m_name == commands[j].m_name)
        {
            // terminate program when command list has duplicates
            // i will not support this behavior and the user should
            // not do this in the first place anyway
            console.error(global.ansi.style.bold + global.termcolor.foreground.rgb(195, 0, 0)
                + "FATAL:" + global.ansi.style.reset + " "
                + "The command list has duplicates, this behavior is not supported!");
            console.error("Please fix this before you continue using this program.");
            global.process_cleanup_and_exit(2);
        }
    }
}

module.exports = commands;
