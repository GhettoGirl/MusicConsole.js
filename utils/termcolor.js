/* Music Console
 * @termcolor.js
 *
 * Terminal color
 * True color RGB codes
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

module.exports = {
    foreground,
    background
}
