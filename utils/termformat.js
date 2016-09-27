/* Music Console
 * @termformat.js
 *
 * Terminal formatting
 *  - ANSI escape sequences (just the basic ones needed for this app)
 *  - True color RGB codes
 *
 */

const foreground =
{
    // returns escape sequence
    rgb: function(r, g, b)
    {
        return "\x1b[38;2;"+r+";"+g+";"+b+"m";
    },

    // sets the color immediately
    set: function(r, g, b)
    {
        process.stdout.write("\x1b[38;2;"+r+";"+g+";"+b+"m");
    }
}

const background =
{
    // returns escape sequence
    rgb: function(r, g, b)
    {
        return "\x1b[48;2;"+r+";"+g+";"+b+"m";
    },

    // sets the color immediately
    set: function(r, g, b)
    {
        process.stdout.write("\x1b[48;2;"+r+";"+g+";"+b+"m");
    }
}

const ansi =
{
    reset:      "\x1b[0m",
    bold:       "\x1b[1m",
    italic:     "\x1b[3m",
    underlined: "\x1b[4m"
}

module.exports = {
    foreground,
    background,
    ansi
}
