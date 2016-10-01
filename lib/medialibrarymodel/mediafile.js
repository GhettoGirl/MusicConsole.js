/* MediaLibraryModel
 * @mediafile.js
 *
 * Object to store data about media files
 *
 */

const fs = require('fs');
const path = require('path');
const tagreader = new (require('lib/tagreader')).TagReader();
const SearchTermGen = require('lib/searchtermgen');

const method = MediaFile.prototype;

function MediaFile(location, check, base_path, audiotypes, videotypes, moduletypes)
{
    this.m_location = location || "";
    this.m_path = path.resolve(this.m_location);
    this.m_location != '' ? this.m_location = jsext.String.splice(this.m_location, 0, base_path.length + 1, '') : false;
    this._m_valid = true; // assume a file exists

    // detect file extension
    this.m_extension = "";
    ext_pos = this.m_location.lastIndexOf('.');
    if (ext_pos != -1)
    {
        this.m_extension = this.m_location.substr(ext_pos + 1).toLowerCase();
    }

    // detect media type by file extension
    this.m_type = 0; // None
    for (const i of audiotypes)
    {
        if (this.m_extension == i)
        {
            this.m_type = 1; // Audio
            break;
        }
    }

    if (this.m_type == 0)
    {
        for (const i of videotypes)
        {
            if (this.m_extension == i)
            {
                this.m_type = 2; // Video
                break;
            }
        }
    }

    if (this.m_type == 0)
    {
        for (const i of moduletypes)
        {
            if (this.m_extension == i)
            {
                this.m_type = 3; // ModuleTracker
                break;
            }
        }
    }

    // add a possibility to check for file existence
    if ((check || false))
    {
        if (this.m_location != "")
        {
            try
            {
                fs.accessSync(this.m_location, fs.F_OK);
                this._m_valid = true;
            }

            catch (error)
            {
                console.error("MediaFile: " + error.name + ": " + error.message);
                this._m_valid = false;
            }
        }
    }
}

method.init = function(prefixdeletionpatterns, base_path)
{
    // tag fields
    this.m_artist = "";
    this.m_album = "";
    this.m_title = "";
    this.m_genre = "";

    // search terms
    this.m_searchterms = [this.m_location.toLowerCase()];

    // delete this prefixes from the initial search term
    if (typeof prefixdeletionpatterns == "object")
    {
        for (const i of prefixdeletionpatterns)
        {
            if (this.m_searchterms[0].startsWith(i))
            {
                this.m_searchterms[0] = this.m_searchterms[0].substr(i.length);
                break;
            }
        }
    }

    // read tags if file exists
    if (this._m_valid)
    {
        if (tagreader.loadFile(base_path + '/' + this.m_location))
        {
            this.m_artist = tagreader.artist();
            this.m_album = tagreader.album();
            this.m_title = tagreader.title();
            this.m_genre = tagreader.genre();
        }

        tagreader.clear();
    }

    // generate additional search terms
    for (const i of SearchTermGen.ALL)
    {
        this.m_searchterms = this.m_searchterms.concat(i.generate(this.m_searchterms[0]));
    }

    // add tags to search terms, if not empty
    if (this.m_artist.replace(/\s/g, '') != '' ||
        this.m_album.replace(/\s/g, '') != '' ||
        this.m_title.replace(/\s/g, '') != '')
    {
        this.m_searchterms = this.m_searchterms.concat(
            [(this.m_artist.toLowerCase() + " " +
              this.m_album.toLowerCase() + " " +
              this.m_title.toLowerCase()).trim()]);
    }
}

// pretty print the media file on screen
method.print = function()
{
    if (this.m_artist.replace(/\s/g, '') == '' &&
        this.m_album.replace(/\s/g, '') == '' &&
        this.m_title.replace(/\s/g, '') == '')
    {
        global.mediafile_printer.print_path(this,
            this.m_location.substr(0, this.m_location.length - this.m_extension.length - 1));
    }

    else
    {
        global.mediafile_printer.print_tagged(this,
            this.m_location.substr(0, this.m_location.length - this.m_extension.length - 1));
    }
}

method.location = function()
{
    return this.m_location;
}

method.artist = function(artist)
{
    if (typeof artist == "undefined")
        return this.m_artist;
    else
        this.m_artist = artist;
}

method.album = function(album)
{
    if (typeof album == "undefined")
        return this.m_album;
    else
        this.m_album = album;
}

method.title = function(title)
{
    if (typeof title == "undefined")
        return this.m_title;
    else
        this.m_title = title;
}

method.genre = function(genre)
{
    if (typeof genre == "undefined")
        return this.m_genre;
    else
        this.m_genre = genre;
}

method.addSearchTerm = function(searchterm)
{
    this.m_searchterms.push(searchterm);
}

method.searchTerms = function()
{
    return this.m_searchterms;
}

method.extension = function()
{
    return this.m_extension;
}

method.type = function()
{
    return this.m_type;
}

module.exports = MediaFile;
