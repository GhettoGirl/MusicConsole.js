/* Music Console
 * @clear-terminal.js
 *
 * Clears all output from the terminal
 *
 */

module.exports = function()
{
    process.stdout.write("\x1bc\x1b[3J");
}
