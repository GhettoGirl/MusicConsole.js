/* kbhit
 * @kbhit.js
 *
 * small kbhit wrapper for breakable infinite loops
 *
 */

const KBHIT = require('lib/kbhit.node');

function kbhit(loopfn)
{
    if (typeof loopfn != "function")
    {
        console.error("kbhit: loopfn must be a function!");
        return;
    }

    while (!KBHIT.kbhit())
    {
        loopfn();
    }

    KBHIT.getchar();
}

module.exports = kbhit;

/* template for non-infinite loops which can end normally
 * but still canceled early by the user
 *
 * i have no idea how to wrap this into a convenient function
 * like the one above :(


const kbhit = require('lib/kbhit.node');

var kbhit_normal_loop_end = false;
while (!kbhit.kbhit())
{
    if (normal end condition)
    {
        kbhit_normal_loop_end = true;
        break;
    }

    // your loop code here
}

// clear input buffer if loop was canceled by the user
if (!kbhit_normal_loop_end)
{
    kbhit.getchar();
}

*/
