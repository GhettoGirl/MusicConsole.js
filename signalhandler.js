/* Music Console
 * @signalhandler.js
 *
 * POSIX signal handler
 * Clean up tasks
 *
 */

function cleanup()
{
    //if (typeof myVar != 'undefined')

    // devnote
    // in the c++ version i don't do any clean ups
    // so this may not be necessary here either
    // but lets see when the medialibrarymodel is finished

    process.exit(0);
}

// === fixme
// signal handling suspended or blocked while native addon has "focus"?
// happens while in the gnu/readline prompt
// sigterm even causes segmentation fault?????
//
// *needs research*

//process.on('SIGINT', cleanup);
//process.on('SIGTERM', cleanup);
//process.on('SIGHUP', cleanup);
