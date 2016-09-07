/* Music Console
 * @console.js
 *
 * Command line processor
 *
 */

// local objects
const readline = require('./build/Release/gnu_readline');

var method = MusicConsole.prototype;

function MusicConsole()
{
}

method.cmd = function()
{
    // run some tests
    console.log(readline.prompt());
    console.log(readline.prompt("> ", 33));
    console.log(readline.prompt("> ", "", 84));

    // loop test - this one actually works
    // note: this is where Node's readline lib failed for me...
    //       the behavior was rather stupid and always ended in ascii clutter in the terminal
    for (var i = 0; i != 3; i++)
    {
        console.log(readline.prompt("# "));
    }
}

module.exports = MusicConsole;
