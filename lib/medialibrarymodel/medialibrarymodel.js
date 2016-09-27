/* MediaLibraryModel
 * @medialibrarymodel.js
 *
 * Build a media library by scanning the filesystem for media files
 *
 */

const fs = require('fs');
const mkdirp = require('extern/node-mkdirp');
const readdir = require('readdir-enhanced');

const MediaFile = require('./mediafile.js');
const MediaCache = require('./mediacache.js');

const SearchKeys = require('./searchkeys.js').SearchKeys;
const SearchPatternType = require('./searchkeys.js').SearchPatternType;

// initialize pretty printer
global.printer = new (require('utils/printer.js'))(
    global.settings.appearance().extension,
    global.settings.appearance().artist,
    global.settings.appearance().album,
    global.settings.appearance().title,
    global.settings.appearance().genre,
    global.settings.appearance().path,
    global.settings.appearance().print_tagged,
    global.settings.appearance().print_path
);

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

    this.m_randomizer = new (require('utils/randomizer.js'));
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
        console.error("MediaLibraryModel: setMediaTypes: TypeError, takes only '[enum] MediaType' and an array");
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
        console.error("MediaLibraryModel: mediaTypes: TypeError, takes only '[enum] MediaType'");
        return [];
    }

    if (media == MediaType.None)
    {
        return      this.m_mediatypes[MediaType.Audio]
            .concat(this.m_mediatypes[MediaType.Video])
            .concat(this.m_mediatypes[MediaType.ModuleTracker]);
    }

    return this.m_mediatypes[media];
}

method.setPrefixDeletionPatterns = function(patterns)
{
    if (typeof patterns != "object")
    {
        console.error("MediaLibraryModel: setPrefixDeletionPatterns: TypeError, must be an array");
        return;
    }

    for (const i of patterns)
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

method.setRandomizerHistorySize = function(size)
{
    this.m_randomizer.setHistorySize(size);
}

method.mediaList = function()
{
    return this.m_medialist;
}

method.filterList = function(type)
{
    if (typeof type != "number" || type == MediaType.None)
    {
        return this.m_medialist;
    }

    return this.m_filterlist[type];
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
    for (const i of this.mediaTypes(MediaType.None))
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
    for (const i of filelist)
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
    for (const i of this.m_medialist)
    {
        if (!this.m_mediacache.getData(i))
        {
            i.init(this.m_prefixdeletionpatterns, this.m_path);
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
    // Check if search term is not empty
    if (typeof search_term != "string" || search_term == '')
    {
        return undefined;
    }

    // Create search patterns, if the search terms are empty, skip search and return nothing
    var search = new SearchKeys(search_term);
    if (search.isEmpty())
    {
        return undefined;
    }

    // Create a media type filter list
    var filterlist = [];
    if (typeof media == "undefined" || media == MediaType.None)
    {
        filterlist = this.m_medialist;
    }

    else
    {
        filterlist = this.m_filterlist[media];
    }

    // Check if search keys has filter patterns and create a search list
    var searchlist = [];
    if (search.containsKey(SearchPatternType.WithoutAnyOfThis) ||
        search.containsKey(SearchPatternType.WithoutGenre))
    {
        var without_any_of_this = search.searchPatterns(SearchPatternType.WithoutAnyOfThis);
        var without_any_of_this_keycount = search.countKeys(SearchPatternType.WithoutAnyOfThis);

        var without_genre = search.searchPatterns(SearchPatternType.WithoutGenre);
        var without_genre_keycount = search.searchPatterns(SearchPatternType.WithoutGenre);

        var mark_as_dont_add = false;

        for (const mediafile of filterlist)
        {
            for (const searchterm of mediafile.searchTerms())
            {
                // keyword filter
                for (let i = 0; i < without_any_of_this_keycount; i++)
                {
                    if (searchterm.match(without_any_of_this[i].pattern))
                    {
                        mark_as_dont_add = true;
                        break; // we are done here
                    }
                }

                // genre filter
                for (let i = 0; i < without_genre_keycount; i++)
                {
                    if (mediafile.genre().match(without_genre[i].pattern))
                    {
                        mark_as_dont_add = true;
                        break; // we are done here
                    }
                }
            }

            if (!mark_as_dont_add)
            {
                searchlist.push(mediafile);
            }

            mark_as_dont_add = false; // reset for next
        }
    }

    else
    {
        searchlist = filterlist;
    }

    // Search: Default, IncludeIntoMainSearch
    for (const mediafile of searchlist)
    {
        for (const searchterm of mediafile.searchTerms())
        {
            for (const pattern of search.searchPatterns())
            {
                if (pattern.type == SearchPatternType.Default ||
                    pattern.type == SearchPatternType.IncludeIntoMainSearch)
                {
                    if (searchterm.match(pattern.pattern))
                    {
                        return mediafile;
                    }
                }
            }
        }
    }

    // nothing found
    return undefined;
}

// searches for media using a given search term
// returns an array of MediaFile's or an empty array
// can be filtered by media type
method.findMultiple = function(search_term, media)
{
    // Check if search term is not empty
    if (typeof search_term != "string" || search_term == '')
    {
        return [];
    }

    // Create search patterns, if the search terms are empty, skip search and return nothing
    var search = new SearchKeys(search_term);
    if (search.isEmpty())
    {
        return [];
    }

    // Create a media type filter list
    var filterlist = [];
    if (typeof media == "undefined" || media == MediaType.None)
    {
        filterlist = this.m_medialist;
    }

    else
    {
        filterlist = this.m_filterlist[media];
    }

    // Store results in this array
    var results = [];

    // Check if search keys has filter patterns and create a search list
    var searchlist = [];
    if (search.containsKey(SearchPatternType.WithoutAnyOfThis) ||
        search.containsKey(SearchPatternType.WithoutGenre))
    {
        var without_any_of_this = search.searchPatterns(SearchPatternType.WithoutAnyOfThis);
        var without_any_of_this_keycount = search.countKeys(SearchPatternType.WithoutAnyOfThis);

        var without_genre = search.searchPatterns(SearchPatternType.WithoutGenre);
        var without_genre_keycount = search.searchPatterns(SearchPatternType.WithoutGenre);

        var mark_as_dont_add = false;

        for (const mediafile of filterlist)
        {
            for (const searchterm of mediafile.searchTerms())
            {
                // keyword filter
                for (let i = 0; i < without_any_of_this_keycount; i++)
                {
                    if (searchterm.match(without_any_of_this[i].pattern))
                    {
                        mark_as_dont_add = true;
                        break; // we are done here
                    }
                }

                // genre filter
                for (let i = 0; i < without_genre_keycount; i++)
                {
                    if (mediafile.genre().match(without_genre[i].pattern))
                    {
                        mark_as_dont_add = true;
                        break; // we are done here
                    }
                }
            }

            if (!mark_as_dont_add)
            {
                searchlist.push(mediafile);
            }

            mark_as_dont_add = false; // reset for next
        }
    }

    else
    {
        searchlist = filterlist;
    }

    // Search: Default, IncludeIntoMainSearch
    for (const mediafile of searchlist)
    {
    next:
        for (const searchterm of mediafile.searchTerms())
        {
            for (const pattern of search.searchPatterns())
            {
                if (pattern.type == SearchPatternType.Default ||
                    pattern.type == SearchPatternType.IncludeIntoMainSearch)
                {
                    if (searchterm.match(pattern.pattern))
                    {
                        results.push(mediafile);
                        break next;
                    }
                }
            }
        }
    }

    // return results
    return results;
}

// returns the media file at a given index
// object is undefined if ouf of bound
method.mediaAt = function(index)
{
    return this.m_medialist[index];
}

// returns a random media file
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
            return this.m_filterlist[media][this.m_randomizer.random(0, this.m_filterlist[media].length - 1)];
        }
    }

    else
    {
        return this.m_medialist[this.m_randomizer.random(0, this.m_medialist.length - 1)];
    }
}

// returns a random media files which matches the given search term
// can be filtered by media type
// the returned object can be undefined
method.randomMediaFiltered = function(search_term, media)
{
    var results = this.findMultiple(search_term, media);
    if (results.length != 0)
    {
        return results[this.m_randomizer.random(0, results.length - 1)];
    }
}

// checks if the library already has a MediaFile object
// for the given file
// resolves the path following any symlinks
method.hasMediaForFile = function(file)
{
    try
    {
        fs.accessSync(file, fs.F_OK);
    }

    catch (error)
    {
        return false;
    }

    for (const i of this.m_medialist)
    {
        if (fs.realpathSync(i.m_path) == fs.realpathSync(file))
        {
            return true;
        }
    }

    return false;
}

// returns the MediaFile object whichs matches the given file
// the file must exist
method.getMediaForFile = function(file)
{
    for (const i of this.m_medialist)
    {
        if (fs.realpathSync(i.m_path) == fs.realpathSync(file))
        {
            return i;
        }
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
