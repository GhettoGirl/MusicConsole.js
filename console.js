/* Music Console
 * @console.js
 *
 * Command line processor
 *
 */

// initialize prompt and history manager
global.readline = new (require('lib/readline')).GnuReadline();
global.history = new (require('sys/history.js'))(global.settings.directory() + "/history",
                                                 global.settings.prompt().histignore_size);
global.readline.setPrompt(eval('"' + global.settings.prompt().line + '"'));

// set sleep interval for kbhit
const kbhit = require('lib/kbhit.node');
kbhit.set_sleep_interval(global.settings.prompt().sleep_interval);

// initialize commands
global.commands = require('sys/commands.js');

const simplifystring = require('utils/simplifystring.js');
const termformat = require('utils/termformat.js');

const method = MusicConsole.prototype;

function MusicConsole()
{
}

// reads user input from the console and generates commands
// splits at every '&&' and generates an array of objects
// eliminates empty entries and simplifies the input
// returns an array of the following object
//   {command, args}
//   'command' is never empty
//   'args' may be empty, but NEVER undefined
method.userInput = function()
{
    var inputbuf = "";
    var splitbuf;
    var commands = [];

    // remove signal handlers
    global.process_deregister_signal_handlers();

    // start GNU/Readline addon (which has its own signal handlers internally)
    inputbuf = readline.prompt();

    // restore default formatting
    process.stdout.write(termformat.ansi.reset);

    // restore signal handlers
    global.process_register_signal_handlers();

    // simplify string, keep first whitespace if any
    inputbuf = simplifystring(inputbuf, true);

    // skip empty input
    if (inputbuf == "" || inputbuf == " ")
    {
        return [];
    }

    // add to history when not starting with a space
    if (inputbuf.startsWith(" "))
    {
        inputbuf = inputbuf.substr(1);
    }

    else
    {
        history.append(inputbuf);
    }

    // split input
    splitbuf = inputbuf.split("&&");

    // eliminate empty entries
    // and trim leading and trailing spaces
    splitbuf = splitbuf.filter(function(value)
    {
        return (simplifystring(value) != '');
    });
    for (const i in splitbuf)
    {
        if (typeof splitbuf[i] == "string")
        {
            splitbuf[i] = splitbuf[i].trim();
        }
    }

    // check if list got empty
    if (splitbuf.length == 0)
    {
        return [];
    }

    // build commands
    for (const i of splitbuf)
    {
        if (i.indexOf(' ') == -1)
        {
            commands.push({
                command: i.toLowerCase(),
                args: ""
            });
        }

        else
        {
            commands.push({
                command: i.substr(0, i.indexOf(' ')).toLowerCase(),
                args: i.substr(i.indexOf(' ') + 1).toLowerCase()
            });
        }
    }

    return commands;
}

method.console = function()
{
    // clear the terminal when entering the console
    termformat.clear();
    global.print_header();

    while (true)
    {
        var commands = this.userInput();
        var cmd_executed = false;
        for (const i of commands)
        {
            // the exit command must match absolutely,
            // if you pass arguments to it, it wil not be executed
            // this makes it possible to not accidently quit the app when something
            // in the library starts with "exit" and you wanna look it up :)
            if ((i.command + i.args) == global.commands.exit.m_name)
            {
                global.commands.exit.execute();
            }

            for (const c of global.commands.commands)
            {
                if (i.command == c.m_name)
                {
                    c.execute(i.args);
                    cmd_executed = true;
                }
            }

            if (!cmd_executed)
            {
                // no command matches, search directly for media and play in audio player
                // or player override if any
                var result = medialib.find(i.command + ' ' + i.args);
                if (result)
                {
                    mediaplayer.execute(result, MediaType.Audio);
                }

                else
                {
                    console.log("No media found.");
                }
            }
        }
    }
}

// just run a commmand without entering the console
method.runCommand = function(command)
{
    var pos = command.indexOf(' ');
    var cmd_executed = false;

    if (pos != -1)
    {
        command = {
            "command": command.substr(0, pos),
            "args": command.substr(pos + 1)
        };
    }

    else
    {
        command = {
            "command": command,
            "args": ""
        };
    }

    for (const c of global.commands.commands)
    {
        if (command.command == c.m_name)
        {
            c.execute(command.args);
            cmd_executed = true;
        }
    }

    if (!cmd_executed)
    {
        // no command matches, search directly for media and play in audio player
        // or player override if any
        var result = medialib.find(command.command + ' ' + command.args);
        if (result)
        {
            mediaplayer.execute(result, MediaType.Audio);
        }

        else
        {
            console.log("No media found.");
            global.process_cleanup_and_exit(6);
        }
    }
}

module.exports = MusicConsole;
