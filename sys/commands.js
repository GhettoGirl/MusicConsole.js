/* Music Console
 * @commands.js
 *
 * Commands
 *
 */

const termformat = require('utils/termformat.js');

const g_cmd = global.settings.commands();
const g_subcmd = global.settings.subcommands();

function cmd(name) { return "commands/" + name + ".js"; }

const commands = [
    new (require(cmd("audio")))       (g_cmd.audio),
    new (require(cmd("video")))       (g_cmd.video),
    new (require(cmd("module")))      (g_cmd.module),
    new (require(cmd("search")))      (g_cmd.search),
    new (require(cmd("browse")))      (g_cmd.browse),
    new (require(cmd("random")))      (g_cmd.random),
    new (require(cmd("shuffle")))     (g_cmd.shuffle),
    new (require(cmd("repeat")))      (g_cmd.repeat),
    new (require(cmd("history")))     (g_cmd.history),
    new (require(cmd("statistics")))  (g_cmd.statistics),
    new (require(cmd("rescan")))      (g_cmd.rescan),
    new (require(cmd("playlist")))    (g_cmd.playlist),
    new (require(cmd("plistfile")))   (g_cmd.plistfile),
    new (require(cmd("favorite")))    (g_cmd.favorite),
    new (require(cmd("clear")))       (g_cmd.clear),
    new (require(cmd("exit")))        (g_cmd.exit)
];

// check if all commands are valid
for (const i of commands)
{
    if (!i.m_valid)
    {
        console.error(termformat.ansi.bold + termformat.foreground.rgb(195, 0, 0)
            + "FATAL:" + termformat.ansi.reset + " "
            + "One or more commands contains spaces, this behavior is not supported!");
        console.error("Please fix this before you continue using this program.");
        global.process_cleanup_and_exit(2);
    }
}

// check command list for duplicate names
for (let i = 0; i < commands.length; i++)
{
    for (let j = 0; j < commands.length; j++)
    {
        if (i != j && commands[i].m_name != '' && commands[j].m_name != '' && commands[i].m_name == commands[j].m_name)
        {
            // terminate program when command list has duplicates
            // i will not support this behavior and the user should
            // not do this in the first place anyway
            console.error(termformat.ansi.bold + termformat.foreground.rgb(195, 0, 0)
                + "FATAL:" + termformat.ansi.reset + " "
                + "The command list has duplicates, this behavior is not supported!");
            console.error("Please fix this before you continue using this program.");
            global.process_cleanup_and_exit(2);
        }
    }
}

// check if all subcommands exists
for (const i in g_subcmd)
{
    if (g_subcmd[i] == "")
    {
        console.error(termformat.ansi.bold + termformat.foreground.rgb(195, 0, 0)
            + "FATAL:" + termformat.ansi.reset + " "
            + "The subcommand list has disabled commands. This is not correct.");
        console.error("Please fix this before you continue using this program.");
        global.process_cleanup_and_exit(2);
    }
}

// remove 'exit' command from the main list and return it separately
module.exports = {
    "commands": commands,
    "exit": commands.pop()
};
