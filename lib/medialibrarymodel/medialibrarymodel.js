/* MediaLibraryModel
 * @medialibrarymodel.js
 *
 * Build a media library by scanning the filesystem for media files
 *
 * TODO list:
 *  × filter
 *  × read tags
 *  × (a lot more)
 *
 */

const fs = require('fs');
const readdir = require('readdir-enhanced');

const method = MediaLibraryModel.prototype;

function MediaLibraryModel()
{
    this.clear();
}

// reset
method.clear = function()
{
    this.m_path = "";
    this.m_filelist = [];
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

// scans the directory for media files, a root path must be set first
method.scan = function()
{
    if (this.m_path == "" || this.m_scanned)
    {
        return false;
    }

    //-- todo: filter media files, user configurable option
    const filter = function(stats)
    {
        if (stats.isFile())
        {
            return true;
        }
    };

    this.m_filelist = readdir.sync(this.m_path, {
        deep: true,
        filter: filter
    });

    this.m_scanned = true;
    return true;
}

module.exports = MediaLibraryModel;
