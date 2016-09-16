/* Music Console
 * @prompt-history.fs
 *
 * History Manager for 'prompt-sync'
 *
 * This history manager has no file size limit
 * and also uses the logic from the original
 * C++ version of Music Console.
 *
 * --> no duplicate entries for the past 2 items
 * --> case insensitive duplicate checks
 *
 */

const fs = require('fs');

module.exports = function history(file) {
    var HIST = [];

    try
    {
        HIST = fs.readFileSync(file, {encoding: 'utf8'}).split('\n').slice(0, -1);
    }

    catch (error)
    {
        console.error("HistoryManager: " + error.name + ": " + error.message);
    }

    var ix = HIST.length;

    return {
        atStart: function()
        {
            return ix <= 0;
        },
        atPenultimate: function()
        {
            return  ix == HIST.length - 1;
        },
        pastEnd: function()
        {
            return ix >= HIST.length;
        },
        atEnd: function()
        {
            return ix == HIST.length;
        },
        prev: function()
        {
            return HIST[--ix];
        },
        next: function()
        {
            return HIST[++ix];
        },
        reset: function()
        {
            ix = HIST.length;
        },
        push: function(str)
        {
            // skip if last 2 items match the current one in unicode case insensitive way
            str = str.toLowerCase();
            if (!(HIST[HIST.length - 1] == str || HIST[HIST.length - 2] == str))
            {
                HIST.push(str);
            }
        },
        save: function()
        {
            fs.writeFileSync(file, HIST.join('\n') + '\n');
        }
    };
}
