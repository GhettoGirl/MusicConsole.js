/* Music Console
 * @console.js
 *
 * Command line processor
 *
 */

// global objects
const GnuReadline = require('./build/Release/GnuReadline');
global.readline = new GnuReadline.GnuReadline();

var method = MusicConsole.prototype;

function MusicConsole()
{
}

method.cmd = function()
{
    // run some tests
    readline.historySet("./history.hist");
    readline.historyLoad();
    for (var i = 0; i != 6; i++)
    {
        var input = readline.prompt("# ");
        readline.historyAppend(input);
    }
    readline.historyAppend();
}

module.exports = MusicConsole;
