/* Music Console
 * @console.js
 *
 * Command line processor
 *
 */

// initialize prompt and history manager
const prompt = require('./extern/prompt-sync') ({
    history: require('./sys/history.js')(settings.directory() + "/history"),
});

const simplifystring = require('./utils/simplifystring.js');

const method = MusicConsole.prototype;

function MusicConsole()
{
}

// reads user input from the console and generates commands
// splits at every '&&' and generates an array of structs
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

    inputbuf = prompt("# ");

    // simplify string, keep first whitespace if any
    inputbuf = simplifystring(inputbuf);

    // skip empty input
    // todo: check if string has only spaces, (same as above)
    if (inputbuf == "")
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
        prompt.history.save();
    }

    // split input
    splitbuf = inputbuf.split("&&");

    // eliminate empty entries
    // and trim leading and trailing spaces
    splitbuf = splitbuf.filter(v => v != '');
    for (var i in splitbuf)
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
    for (var i of splitbuf)
    {
        if (i.indexOf(' ') == -1)
        {
            commands.push({
                command: i,
                args: ""
            });
        }

        else
        {
            commands.push({
                command: i.substr(0, i.indexOf(' ')),
                args: i.substr(i.indexOf(' ') + 1)
            });
        }
    }

    return commands;
}

method.main = function()
{
    // test user input
    var test = this.userInput();
    console.log("len: " + test.length);
    for (var i of test)
    {
        console.log("cmd: '" + i.command + "'");
        console.log("arg: '" + i.args + "'");
        console.log("-----");
    }
}

module.exports = MusicConsole;
