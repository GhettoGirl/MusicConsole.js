/* Music Console
 * @signalhandler.js
 *
 * Signal handler
 *
 */

const termformat = require('utils/termformat.js');

global.process_cleanup_and_exit = function(ret)
{
    // someday there may be something in here

    if (typeof ret == "number")
    {
        process.exit(ret);
    }

    else
    {
        process.exit(0);
    }
}

process.on('SIGINT', global.process_cleanup_and_exit);
process.on('SIGTERM', global.process_cleanup_and_exit);
process.on('SIGHUP', global.process_cleanup_and_exit);

// display exceptions a bit cleaner and more friendly
// don't spam one million 'at' lines to the terminal
// i know my project structure and files, i don't need
// a spammy stack trace...
// also this overrides the default exit code of 1 with 5
process.on('uncaughtException', function(err)
{
    console.error(termformat.ansi.bold + termformat.foreground.rgb(180, 0, 0) +
                  err.name + ":" + termformat.ansi.reset + " " + err.message);

    // display only first line of strack trace, remove the 'at' from the beginning
    var stack = err.stack.split(/[\n\r]/gm)[1].trim();
    stack = stack.substr(3);

    console.error(termformat.ansi.italic + " at: " + termformat.ansi.reset + stack);

    process.exit(5);
});
