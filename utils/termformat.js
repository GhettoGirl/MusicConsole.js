/* Music Console
 * @termformat.js
 *
 * Terminal formatting
 *  - ANSI escape sequences (just the basic ones needed for this app)
 *  - True color RGB codes
 *
 */

// Change foreground color using RGB code
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

// Change background color using RGB code
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

// ANSI escape sequences
const ansi =
{
    reset:      "\x1b[0m",
    bold:       "\x1b[1m",
    italic:     "\x1b[3m",
    underlined: "\x1b[4m",
}

// Clears all output from the terminal
function clear()
{
    // \u001b[2J\u001b[0;0H
    // \x1B[2J\x1B[0f
    process.stdout.write("\x1bc\x1b[3J");
}

module.exports = {
    foreground,
    background,
    ansi,
    clear
}
