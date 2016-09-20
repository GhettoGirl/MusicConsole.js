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

    // todo: remove inner whitespace chains

    return buf;
};
