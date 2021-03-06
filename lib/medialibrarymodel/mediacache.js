/* MediaLibraryModel
 * @mediacache.js
 *
 * Cache data of 'MediaFiles's for fast access
 *
 */

const fs = require('fs');
const mkdirp = require('extern/node-mkdirp');
const sha1 = require('sha1');
const serializer = require('node-pack');

const method = MediaCache.prototype;

function MediaCache(path)
{
    this.m_path = path;
}

// writes data into the cache from the specified media file
// return: bool
method.writeData = function(mediafile)
{
    if (typeof mediafile != "object")
    {
        return false;
    }

    // prepare data for serialization
    var data = [
        mediafile.m_artist,
        mediafile.m_album,
        mediafile.m_title,
        mediafile.m_genre
    ].concat(mediafile.m_searchterms);

    // calculate path for cache file
    var hash = sha1(mediafile.m_location);
    var path = hash.substr(0, 15) + '/'
             + hash.substr(15, 15);
    var file = hash.substr(30, 10);

    // create cache directory
    mkdirp.sync(this.m_path + '/' + path);

    // binary serialize data
    var buffer = serializer.encode(data);

    try
    {
        fs.writeFileSync(this.m_path + '/' + path + '/' + file, buffer);
        return true;
    }

    catch (error)
    {
        return false;
    }
}

// searches the cache for data and writes it into the media file
// return: bool
method.getData = function(mediafile)
{
    if (typeof mediafile != "object")
    {
        return false;
    }

    // calculate path of cache file
    var hash = sha1(mediafile.m_location);
    var path = hash.substr(0, 15) + '/'
             + hash.substr(15, 15);
    var file = hash.substr(30, 10);

    // check if the file exists
    try
    {
        fs.accessSync(this.m_path + '/' + path + '/' + file, fs.F_OK);
    }

    catch (error)
    {
        return false;
    }

    // load the binary serialized data
    var buffer = fs.readFileSync(this.m_path + '/' + path + '/' + file);
    var data = serializer.decode(buffer);

    // store back to media file
    if (data.length > 4)
    {
        mediafile.m_artist = data[0];
        mediafile.m_album = data[1];
        mediafile.m_title = data[2];
        mediafile.m_genre = data[3];
        mediafile.m_searchterms = data.slice(4);
        return true;
    }

    return false;
}

module.exports = MediaCache;
