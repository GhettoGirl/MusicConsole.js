/* js-extensions
 * @RegExp.js
 *
 * Extensions for Regular Expressions
 *
 */

const splice = require('./String.js').splice;

module.exports = {

// Returns the raw expression without its properties.
toStringRaw: function(regex)
{
    var buf = regex.toString();

    if (buf.startsWith('/'))
    {
        buf = splice(buf, 0, 1, '');
    }

    var pos_last_slash = buf.lastIndexOf('/');
    if (pos_last_slash != -1)
    {
        buf = splice(buf, pos_last_slash, buf.length - pos_last_slash, '');
    }

    return buf;
}

};
