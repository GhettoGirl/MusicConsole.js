/* Utils
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
    process.stdout.write(jsext.String.replaceAll(this.m_extension, "%s", string) + '\n');
}

method.artist = function(string)
{
    process.stdout.write(jsext.String.replaceAll(this.m_artist, "%s", string) + '\n');
}

method.album = function(string)
{
    process.stdout.write(jsext.String.replaceAll(this.m_album, "%s", string) + '\n');
}

method.title = function(string)
{
    process.stdout.write(jsext.String.replaceAll(this.m_title, "%s", string) + '\n');
}

method.genre = function(string)
{
    process.stdout.write(jsext.String.replaceAll(this.m_genre, "%s", string) + '\n');
}

method.path = function(string)
{
    process.stdout.write(jsext.String.replaceAll(this.m_path, "%s", string) + '\n');
}

method.print_tagged = function(extension, artist, album, title, genre, path)
{
    var string = this.m_print_tagged;
    string = jsext.String.replaceAll(string, "\\$extension",
                 jsext.String.replaceAll(this.m_extension, "%s", extension));
    string = jsext.String.replaceAll(string, "\\$artist",
                 jsext.String.replaceAll(this.m_artist, "%s", artist));
    string = jsext.String.replaceAll(string, "\\$album",
                 jsext.String.replaceAll(this.m_album, "%s", album));
    string = jsext.String.replaceAll(string, "\\$title",
                 jsext.String.replaceAll(this.m_title, "%s", title));
    string = jsext.String.replaceAll(string, "\\$genre",
                 jsext.String.replaceAll(this.m_genre, "%s", genre));
    string = jsext.String.replaceAll(string, "\\$path",
                 jsext.String.replaceAll(this.m_path, "%s", path));
    process.stdout.write(string + '\n');
}

method.print_path = function(extension, artist, album, title, genre, path)
{
    var string = this.m_print_path;
    string = jsext.String.replaceAll(string, "\\$extension",
                 jsext.String.replaceAll(this.m_extension, "%s", extension));
    string = jsext.String.replaceAll(string, "\\$artist",
                 jsext.String.replaceAll(this.m_artist, "%s", artist));
    string = jsext.String.replaceAll(string, "\\$album",
                 jsext.String.replaceAll(this.m_album, "%s", album));
    string = jsext.String.replaceAll(string, "\\$title",
                 jsext.String.replaceAll(this.m_title, "%s", title));
    string = jsext.String.replaceAll(string, "\\$genre",
                 jsext.String.replaceAll(this.m_genre, "%s", genre));
    string = jsext.String.replaceAll(string, "\\$path",
                 jsext.String.replaceAll(this.m_path, "%s", path));
    process.stdout.write(string + '\n');
}

module.exports = Printer;
