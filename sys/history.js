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

function HistoryManager(file, ignore_size)
{
    global.readline.historySet(file);
    global.readline.historyLoad();

    this.m_ignore_size = ignore_size;
}

method.append = function(string)
{
    var item = string.toLowerCase();

    // skip every item which matches any of the ignore patterns
    for (const i of global.settings.histignore())
    {
        if (item.match(i))
        {
            return;
        }
    }

    // check if last n items are identical to the current item
    // don't append if this is the case
    if (!global.readline.historyGet(this.m_ignore_size).includes(item))
    {
        global.readline.historyAppend(item);
    }
}

module.exports = HistoryManager;
