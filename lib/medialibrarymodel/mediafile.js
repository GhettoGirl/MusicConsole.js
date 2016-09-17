/* MediaLibraryModel
 * @mediafile.js
 *
 * Object to store data about media files
 *
 */

const fs = require('fs');

const TagReader = require('../TagReader');
const tagreader = new TagReader.TagReader();

const method = MediaFile.prototype;

function MediaFile(location, prefixdeletionpatterns, check)
{
    this.m_location = location || "";
    this._m_valid = true; // assume a file exists

    // detect file extension
    this.m_extension = "";
    ext_pos = this.m_location.lastIndexOf('.');
    if (ext_pos != -1)
    {
        this.m_extension = this.m_location.substr(ext_pos + 1).toLowerCase();
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
        for (var i of prefixdeletionpatterns)
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
        if (tagreader.loadFile(this.m_location))
        {
            this.m_artist = tagreader.artist();
            this.m_album = tagreader.album();
            this.m_title = tagreader.title();
            this.m_genre = tagreader.genre();
        }

        tagreader.clear();
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

module.exports = MediaFile;
