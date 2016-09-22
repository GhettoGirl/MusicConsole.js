/* Music Console
 * @history.fs
 *
 * History Manager for GNU/Readline native addon
 *
 *  --> no duplicate entries for the past 2 items
 *  --> case insensitive duplicate checks
 *
 */

const method = HistoryManager.prototype;

function HistoryManager(file)
{
    global.readline.historySet(file);
    global.readline.historyLoad();
}

method.append = function(string)
{
    var item = string.toLowerCase();

    // skip every item which matches any of the ignore patterns
    for (const i of global.settings.histignore())
    {
        if (item.match(i) != null)
        {
            return;
        }
    }

    // check if last 2 items are identical to current item
    var HIST = global.readline.historyGet(2);
    if (!(HIST[HIST.length - 1] == item || HIST[HIST.length - 2] == item))
    {
        global.readline.historyAppend(item);
    }
    HIST.length = 0;
}

module.exports = HistoryManager;
