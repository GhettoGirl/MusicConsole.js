/* Music Console
 * @termcolor.js
 *
 * Terminal color
 * True color RGB codes
 *
 */

var foreground =
{
    // returns escape sequence
    rgb: function(r, g, b)
    {
        return "\033[38;2;"+r+";"+g+";"+b+"m";
    },

    // sets the color immediately
    set: function(r, g, b)
    {
        process.stdout.write("\033[38;2;"+r+";"+g+";"+b+"m");
    }
}

var background =
{
    // returns escape sequence
    rgb: function(r, g, b)
    {
        return "\033[48;2;"+r+";"+g+";"+b+"m";
    },

    // sets the color immediately
    set: function(r, g, b)
    {
        process.stdout.write("\033[48;2;"+r+";"+g+";"+b+"m");
    }
}

module.exports = {
    foreground,
    background
}
