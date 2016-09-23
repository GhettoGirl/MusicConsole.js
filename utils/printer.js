/* Music Console
 * @printer.js
 *
 * { MediaFile related }
 *
 * Eval escape sequenced strings to change
 * the terminal appearance.
 *
 */

const method = Printer.prototype;

function Printer(extension, artist, album, title, genre, path, print_tagged, print_path)
{
    this.m_extension = eval("'" + extension + "'") + '\x1b[0m';
    this.m_artist =    eval("'" + artist    + "'") + '\x1b[0m';
    this.m_album =     eval("'" + album     + "'") + '\x1b[0m';
    this.m_title =     eval("'" + title     + "'") + '\x1b[0m';
    this.m_genre =     eval("'" + genre     + "'") + '\x1b[0m';
    this.m_path =      eval("'" + path      + "'") + '\x1b[0m';

    this.m_print_tagged = print_tagged;
    this.m_print_path = print_path;
}

method.extension = function(string)
{
    process.stdout.write(global.jsext.String.replaceAll(this.m_extension, "%s", string) + '\n');
}

method.artist = function(string)
{
    process.stdout.write(global.jsext.String.replaceAll(this.m_artist, "%s", string) + '\n');
}

method.album = function(string)
{
    process.stdout.write(global.jsext.String.replaceAll(this.m_album, "%s", string) + '\n');
}

method.title = function(string)
{
    process.stdout.write(global.jsext.String.replaceAll(this.m_title, "%s", string) + '\n');
}

method.genre = function(string)
{
    process.stdout.write(global.jsext.String.replaceAll(this.m_genre, "%s", string) + '\n');
}

method.path = function(string)
{
    process.stdout.write(global.jsext.String.replaceAll(this.m_path, "%s", string) + '\n');
}

method.print_tagged = function(extension, artist, album, title, genre, path)
{
    var string = this.m_print_tagged;
    string = global.jsext.String.replaceAll(string, "\\$extension",
                 global.jsext.String.replaceAll(this.m_extension, "%s", extension));
    string = global.jsext.String.replaceAll(string, "\\$artist",
                 global.jsext.String.replaceAll(this.m_artist, "%s", artist));
    string = global.jsext.String.replaceAll(string, "\\$album",
                 global.jsext.String.replaceAll(this.m_album, "%s", album));
    string = global.jsext.String.replaceAll(string, "\\$title",
                 global.jsext.String.replaceAll(this.m_title, "%s", title));
    string = global.jsext.String.replaceAll(string, "\\$genre",
                 global.jsext.String.replaceAll(this.m_genre, "%s", genre));
    string = global.jsext.String.replaceAll(string, "\\$path",
                 global.jsext.String.replaceAll(this.m_path, "%s", path));
    process.stdout.write(string + '\n');
}

method.print_path = function(extension, artist, album, title, genre, path)
{
    var string = this.m_print_path;
    string = global.jsext.String.replaceAll(string, "\\$extension",
                 global.jsext.String.replaceAll(this.m_extension, "%s", extension));
    string = global.jsext.String.replaceAll(string, "\\$artist",
                 global.jsext.String.replaceAll(this.m_artist, "%s", artist));
    string = global.jsext.String.replaceAll(string, "\\$album",
                 global.jsext.String.replaceAll(this.m_album, "%s", album));
    string = global.jsext.String.replaceAll(string, "\\$title",
                 global.jsext.String.replaceAll(this.m_title, "%s", title));
    string = global.jsext.String.replaceAll(string, "\\$genre",
                 global.jsext.String.replaceAll(this.m_genre, "%s", genre));
    string = global.jsext.String.replaceAll(string, "\\$path",
                 global.jsext.String.replaceAll(this.m_path, "%s", path));
    process.stdout.write(string + '\n');
}

module.exports = Printer;
