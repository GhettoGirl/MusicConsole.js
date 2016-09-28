/* Music Console
 * @console.js
 *
 * Command line processor
 *
 */

// initialize prompt and history manager
global.readline = new (require('lib/GnuReadline')).GnuReadline();
global.history = new (require('sys/history.js'))(global.settings.directory() + "/history");
global.readline.setPrompt(global.settings.prompt().line);

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

    inputbuf = readline.prompt();

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
                if (typeof result != "undefined")
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
    console.log(command);
}

module.exports = MusicConsole;
