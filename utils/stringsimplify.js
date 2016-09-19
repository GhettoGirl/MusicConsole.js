/* Music Console
 * @stringsimplify.js
 *
 * Simplifies strings
 *
 */

module.exports = function(string)
{
    var buf = string;
    buf = buf.trim();

/*
    for (var i = 0; i < buf.length; i++)
    {
        if (buf[i] == ' ' && buf[i + 1] == ' ')
        {
            buf = buf.replaceAt(i, 2, ' ');
            i--;
        }
    }
*/

    return buf;
};
