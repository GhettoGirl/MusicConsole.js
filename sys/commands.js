/* Music Console
 * @commands.js
 *
 * Commands
 *
 */

const CmdHistory = new (require('../commands/history.js'))(global.settings.commands().history);
const CmdExit = new (require('../commands/exit.js'))(global.settings.commands().exit);

module.exports = [
    CmdHistory,
    CmdExit
];
