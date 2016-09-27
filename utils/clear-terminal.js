/* Music Console
 * @clear-terminal.js
 *
 * Clears all output from the terminal
 *
 */

module.exports = function()
{
    // \u001b[2J\u001b[0;0H
    // \x1B[2J\x1B[0f
    process.stdout.write("\x1bc\x1b[3J");
}
