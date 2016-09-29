/* MediaLibraryModel
 * @printer.js
 *
 * Eval escape sequenced strings to change
 * the terminal appearance.
 *
 * Used to pretty print MediaFile objects on screen.
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

// resolves all placeholders with the mediafile metadata
method.resolvePlaceholders = function(string, mediafile, path)
{
    string = jsext.String.replaceAll(string, "\\$extension",
                 jsext.String.replaceAll(this.m_extension, "%s", mediafile.extension()));
    string = jsext.String.replaceAll(string, "\\$artist",
                 jsext.String.replaceAll(this.m_artist, "%s", mediafile.artist()));
    string = jsext.String.replaceAll(string, "\\$album",
                 jsext.String.replaceAll(this.m_album, "%s", mediafile.album()));
    string = jsext.String.replaceAll(string, "\\$title",
                 jsext.String.replaceAll(this.m_title, "%s", mediafile.title()));
    string = jsext.String.replaceAll(string, "\\$genre",
                 jsext.String.replaceAll(this.m_genre, "%s", mediafile.genre()));
    string = jsext.String.replaceAll(string, "\\$path",
                 jsext.String.replaceAll(this.m_path, "%s", path));
    return string;
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

method.print_tagged = function(mediafile, path)
{
    process.stdout.write(this.resolvePlaceholders(this.m_print_tagged, mediafile, path) + '\n');
}

method.print_path = function(mediafile, path)
{
    process.stdout.write(this.resolvePlaceholders(this.m_print_path, mediafile, path) + '\n');
}

module.exports = Printer;
