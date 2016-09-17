/* Music Console
 * @signalhandler.js
 *
 * POSIX signal handler
 * Clean up tasks
 *
 */

global.process_cleanup_and_exit = function(ret)
{
    // devnote
    // in the c++ version i don't do any clean ups
    // so this may not be necessary here either
    // but lets see when the medialibrarymodel is finished

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
