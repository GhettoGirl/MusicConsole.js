/* Music Console
 * @console.js
 *
 * Command line processor
 *
 */

var method = MusicConsole.prototype;

function MusicConsole()
{
}

method.cmd = function()
{
    console.log("entered console");
}

module.exports = MusicConsole;
