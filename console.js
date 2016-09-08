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


// --- currently a ripoff from the c++ version
//     has bad performance in js
//     needs to be improved anyway
// returns ???, split at '&&'
method.userInput = function()
{
    var append_to_history = true;
    var inputbuf = "";
    var splitbuf; // ???
        // ref: in c++ mc this is
        // struct ConsoleCommand {
        //     QString cmd;
        //     QString args;
        // };

    inputbuf = readline.prompt("# ");

    // todo: simplify string, keep first whitespace if any
    //       needs comprehensive unicode character tools to be implemented first
    //       example: U+3000 == 0x20

    // skip empty input
    // todo: check if string has only spaces, (same as above)
    if (false)
    {
        delete inputbuf;
        delete splitbuf;
        return "";
    }

    // set history preference
    if (inputbuf.startsWith(" "))
    {
        inputbuf = inputbuf.substr(1);
        append_to_history = false;
    }

    // split input
    splitbuf = inputbuf.split("&&");

    // skip empty input
    if (splitbuf.length == 0)
    {
        delete inputbuf;
        delete splitbuf;
        return "";
    }

    // eliminate empty entries
    // todo: requires unicode char tools

    // check if list got empty
    if (splitbuf.length == 0)
    {
        delete inputbuf;
        delete splitbuf;
        return "";
    }

    // build commands
    // todo:---learn more javascript first :^)

    // skip empty command list
    if (splitbuf.length == 0)
    {
        delete inputbuf;
        delete splitbuf;
        return "";
    }

    // clear temporaries
    delete splitbuf;

    // append to history file
    if (append_to_history)
    {
        // todo:---implement basic user settings manager first
        //         we need a place where to store the file
        //         which is $XDG_CONFIG_DIR/MusicConsole etc.
    }

    // clear input buffer
    delete inputbuf;
}

method.main = function()
{
    // this.userInput();

    console.log(global.settings.directory());
}

module.exports = MusicConsole;
