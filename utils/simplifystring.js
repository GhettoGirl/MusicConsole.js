/* Music Console
 * @stringsimplify.js
 *
 * Simplifies strings
 *
 */

const WhitespaceGen = require('../lib/searchtermgen').WhitespaceGen;

module.exports = function(string, keepfirstspace)
{
    var buf = string;
    var prepend_space = false;

    if (typeof keepfirstspace == "boolean" && keepfirstspace)
    {
        if (WhitespaceGen.isWhitespace(buf[0]))
        {
            prepend_space = true;
        }
    }

    buf = WhitespaceGen.toRegularSpace(buf.trim());

    // remove inner whitespace chains, replace them by one regular space
    for (var i = 0; i < buf.length; i++)
    {
        if (buf[i] == ' ' && buf[i + 1] == ' ')
        {
            buf = buf.splice(i, 2, ' ');
            i--;
        }
    }

    if (prepend_space)
    {
        buf = ' ' + buf;
    }

    return buf;
};
