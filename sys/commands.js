/* Music Console
 * @commands.js
 *
 * Commands
 *
 */

const CmdExit = new (require('../commands/exit.js'))(global.settings.commands().exit);

module.exports = [
    CmdExit
];
