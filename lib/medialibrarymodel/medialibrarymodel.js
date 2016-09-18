/* MediaLibraryModel
 * @medialibrarymodel.js
 *
 * Build a media library by scanning the filesystem for media files
 *
 * TODO list:
 *  × (a lot more)
 *
 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const readdir = require('readdir-enhanced');

const MediaFile = require('./mediafile.js');
const MediaCache = require('./mediacache.js');

const method = MediaLibraryModel.prototype;

const MediaType = {
    None: 0,
    Audio: 1,
    Video: 2,
    ModuleTracker: 3
}

function MediaLibraryModel()
{
    this.clear();

    this.m_mediatypes = { 0: [], 1: [], 2: [], 3: [] };
    this.m_prefixdeletionpatterns = [];

    this.m_cachedir = "";
}

// clears path and file list
method.clear = function()
{
    this.m_path = "";
    this.m_medialist = [];
    this.m_scanned = false;
}

// sets the root path of the media library
method.setPath = function(path)
{
    this.clear();

    try
    {
        fs.accessSync(path, fs.F_OK);
        this.m_path = path;
        return true;
    }

    catch (error)
    {
        console.error("MediaLibraryModel: " + error.name + ": " + error.message);
        return false;
    }
}

// returns the root path of the media library
method.path = function()
{
    return this.m_path;
}

// sets the path where to store or read the cache
method.setCachePath = function(cachedir)
{
    if (typeof cachedir != "string" && cachedir == "")
    {
        console.error("MediaLibraryModel: setCachePath: needs a path");
        return;
    }

    this.m_cachedir = cachedir;

    // attempt to create the cache directory
    mkdirp.sync(this.m_cachedir);

    // make sure the cache directory exists and is readable
    try
    {
        fs.accessSync(this.m_cachedir, fs.F_OK);
    }

    catch (error)
    {
        console.error("MediaLibraryModel: " + error.name + ": " + error.message);
        console.error("Unable to create/access cache directory: " + this.m_cachedir);
        return;
    }

    // create the caching object
    this.m_mediacache = new MediaCache(this.m_cachedir);
}

// returns the cache directory
method.cachePath = function()
{
    return this.m_cachedir;
}

// sets extensions for a media type for the filter
//  media = [enum] MediaType
//  extensions = array of strings
method.setMediaTypes = function(media, extensions)
{
    if (typeof media != "number" || typeof extensions != "object")
    {
        console.error("MediaLibraryModel: setMediaTypes: type error, takes only '[enum] MediaType' and an array");
        return;
    }

    if (media == MediaType.None)
    {
        return;
    }

    this.m_mediatypes[media] = extensions;
}

// returns the set of extensions for the given media type
method.mediaTypes = function(media)
{
    if (typeof media != "number")
    {
        console.error("MediaLibraryModel: mediaTypes: type error, takes only '[enum] MediaType'");
        return [];
    }

    if (media == MediaType.None)
    {
        return this.m_mediatypes[MediaType.Audio].concat(
               this.m_mediatypes[MediaType.Video]).concat(
               this.m_mediatypes[MediaType.ModuleTracker]);
    }

    return this.m_mediatypes[media];
}

method.setPrefixDeletionPatterns = function(patterns)
{
    if (typeof patterns != "object")
    {
        console.error("MediaLibraryModel: setPrefixDeletionPatterns: type error, must be an array");
        return;
    }

    this.m_prefixdeletionpatterns = patterns;
}

method.prefixDeletionPatterns = function()
{
    return this.m_prefixdeletionpatterns;
}

// scans the directory for media files, a root path must be set first
method.scan = function()
{
    if (this.m_path == "" || this.m_scanned)
    {
        return false;
    }

    // create filter for 'readdir-enhanced'
    var filter = "";
    for (var i of this.mediaTypes(MediaType.None))
    {
        filter += ".*\\." + i + "|";
    }
    filter = filter.substr(0, filter.length - 1);

    // iterate over filesystem
    filelist = readdir.sync(this.m_path, {
        deep: true,
        basePath: this.m_path, // use relative paths
        filter: new RegExp(filter, 'i')
    });

    // create list of media files
    for (var i of filelist)
    {
        this.m_medialist.push(new MediaFile(i));
    }

    filelist = [];

    // initialize media files
    //  1. try to load from cache
    //  2. if there is no cached data, create one
    for (var i of this.m_medialist)
    {
        if (!this.m_mediacache.getData(i))
        {
            i.init(this.m_prefixdeletionpatterns);
            this.m_mediacache.writeData(i);
        }
    }

    this.m_scanned = true;
    return true;
}

module.exports = {
    MediaLibraryModel,
    MediaType
};
