/* Utils
 * @resolve-env.js
 *
 * Resolves environment variables in strings
 * Only POSIX-style variables are supported
 *
 * TODO: add windows-style environment variable support, %ENVVAR%
 *
 */

const re = /\$(([a-zA-Z_]+[a-zA-Z0-9_]*)|\{([a-zA-Z_]+[a-zA-Z0-9_]*)\})/g;

module.exports = function(input)
{
    return input.replace(re, function($0, $1, $2, $3)
    {
        var key = $2 || $3;

        if (process.env.hasOwnProperty(key))
        {
            return process.env[key];
        }

        return '';
    });
};
