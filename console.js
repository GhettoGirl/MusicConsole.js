/* Music Console
 * @console.js
 *
 * Command line processor
 *
 */

// initialize prompt and history manager
const prompt = require('./extern/prompt-sync') ({
    history: require('./utils/prompt-history.js')(settings.directory() + "/history"),
});

var method = MusicConsole.prototype;

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

    // todo: simplify string, keep first whitespace if any
    //       needs comprehensive unicode character tools to be implemented first
    //       example: U+3000 == 0x20

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
    // todo: requires unicode char tools

    // check if list got empty
    if (splitbuf.length == 0)
    {
        return [];
    }

    // build commands
    for (var i in splitbuf)
    {
        if (splitbuf[i].indexOf(' ') == -1)
        {
            commands.push({
                command: splitbuf[i],
                args: ""
            });
        }

        else
        {
            commands.push({
                command: splitbuf[i].substr(0, splitbuf[i].indexOf(' ')),
                args: splitbuf[i].substr(splitbuf[i].indexOf(' ') + 1)
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
    for (var i in test)
    {
        console.log("cmd: " + test[i].command);
        console.log("arg: " + test[i].args);
        console.log("-----");
    }

    setTimeout(function(){}, 10000);
}

module.exports = MusicConsole;
