/* Utils
 * @resolve-env.js
 *
 * Resolves environment variables in strings
 *
 * Supports both, POSIX and Windows-style environment variables
 *
 */

var re;

if (process.platform == 'win32')
{
    // match Windows (%%) style environment variables
    re = /%([^%]+)%/g;
}

else
{
    // match POSIX ($) style environment variables
    // fixme: doesn't has the ability to escape the '$' character, otherwise correct
    re = /\$(([a-zA-Z_]+[a-zA-Z0-9_]*)|\{([a-zA-Z_]+[a-zA-Z0-9_]*)\})/g;
}

module.exports = function(input)
{
    return input.replace(re, function($0, $1, $2, $3)
    {
        var key = (process.platform == 'win32' ? $1 : $2 || $3);

        if (process.env.hasOwnProperty(key))
        {
            return process.env[key];
        }

        return '';
    });
};
