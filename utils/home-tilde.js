/* Utils
 * @home-tilde.js
 *
 * Replaces the users home path in a string with a tilde (~)
 *
 */

module.exports = function(string)
{
    var HOME = process.env["HOME"];

    if (typeof HOME != "undefined" && typeof string == "string")
    {
        if (string.startsWith(HOME))
        {
            return '~' + string.substr(HOME.length);
        }
    }

    return string;
};
