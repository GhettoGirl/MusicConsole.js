/* MediaLibraryModel
 * @filesystemmodel.js
 *
 * Recursive filesystem operations
 *
 */

const fs = require('fs');
const fs_scanner = require('./deps/walksync.js');

const method = FileSystemModel.prototype;

function FileSystemModel()
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

// sets the root path of the filesystem model
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
        console.error("FileSystemModel: " + error.name + ": " + error.message);
        return false;
    }
}

// returns the root path of the filesystem model
method.path = function()
{
    return this.m_path;
}

// scans the directory for files, a root path must be set first
method.scan = function()
{
    if (this.m_path == "" || this.m_scanned)
    {
        return false;
    }

    this.m_filelist = fs_scanner(this.m_path);
    this.m_scanned = true;
    return true;
}

module.exports = FileSystemModel;
