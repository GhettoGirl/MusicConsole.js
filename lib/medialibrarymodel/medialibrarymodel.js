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
const readdir = require('readdir-enhanced');
const randomizer = require('../../utils/randomizer.js');

const MediaFile = require('./mediafile.js');
const MediaCache = require('./mediacache.js');

const SearchKeys = require('./searchkeys.js').SearchKeys;
const SearchPatternType = require('./searchkeys.js').SearchPatternType;

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
    this.m_filterlist = { 1: [], 2: [], 3: [] };
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
        return false;
    }

    this.m_cachedir = cachedir;

    // attempt to create the cache directory
    global.mkdirp.sync(this.m_cachedir);

    // make sure the cache directory exists and is readable
    try
    {
        fs.accessSync(this.m_cachedir, fs.F_OK);
    }

    catch (error)
    {
        console.error("MediaLibraryModel: " + error.name + ": " + error.message);
        console.error("Unable to create/access cache directory: " + this.m_cachedir);
        return false;
    }

    // create the caching object
    this.m_mediacache = new MediaCache(this.m_cachedir);
    return true;
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

    for (var i of patterns)
    {
        if (typeof i == "string")
        {
            this.m_prefixdeletionpatterns.push(i.toLowerCase());
        }
    }
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
    try
    {
        filelist = readdir.sync(this.m_path, {
            deep: true,
            basePath: this.m_path, // use relative paths
            filter: new RegExp(filter, 'i') // todo: exclude hidden (.*) directories
        });
    }

    catch (error)
    {
        console.error("MediaLibraryModel: " + error.name + ": " + error.message);
        return false;
    }

    // create list of media files
    for (var i of filelist)
    {
        this.m_medialist.push(new MediaFile(i, false, this.m_path,
                                            this.mediaTypes(MediaType.Audio),
                                            this.mediaTypes(MediaType.Video),
                                            this.mediaTypes(MediaType.ModuleTracker)));
    }

    filelist.length = 0;

    // initialize media files
    //  1. try to load from cache
    //  2. if there is no cached data, create one
    //  3. create filter lists
    for (var i of this.m_medialist)
    {
        if (!this.m_mediacache.getData(i))
        {
            i.init(this.m_prefixdeletionpatterns);
            this.m_mediacache.writeData(i);
        }

        if (i.type() != MediaType.None)
        {
            this.m_filterlist[i.type()].push(i);
        }
    }

    this.m_scanned = true;
    return true;
}

// rescan the directory for media files
method.rescan = function()
{
    this.m_medialist = [];
    this.m_filterlist = { 1: [], 2: [], 3: [] };
    this.m_scanned = false;

    return this.scan();
}

// searches for media using a given search term
// returns a single MediaFile object or undefined
// can be filtered by media type
method.find = function(search_term, media)
{
}

// searches for media using a given search term
// returns an array of MediaFile's or an empty array
// can be filtered by media type
method.findMultiple = function(search_term, media)
{
}

// returns the media file at a given index
// object is undefined if ouf of bound
method.mediaAt = function(index)
{
    return this.m_medialist[index];
}

// returns random media file
// can be filtered by media type
// the returned object is never null or undefined, except
// there is no media for a specific type
// the 'count' function can be used to ckeck this beforehand
method.randomMedia = function(media)
{
    if (typeof media == "number" && media != MediaType.None)
    {
        // can be undefined
        if (typeof this.m_filterlist[media] != "undefined")
        {
            return this.m_filterlist[media][randomizer(0, this.m_filterlist[media].length - 1)];
        }
    }

    else
    {
        return this.m_medialist[randomizer(0, this.m_medialist.length - 1)];
    }
}

// returns the number of media files in the library
// counter can by filtered by media type
method.count = function(media)
{
    if (typeof media == "number" && media != MediaType.None)
    {
        // can be undefined
        if (typeof this.m_medialist[media] != "undefined")
        {
            return this.m_filterlist[media].length;
        }

        else
        {
            return 0;
        }
    }

    else
    {
        return this.m_medialist.length;
    }
}

module.exports = {
    MediaLibraryModel,
    MediaType
};
