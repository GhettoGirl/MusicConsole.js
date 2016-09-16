/* MediaLibraryModel
 * @deps/walksync.js
 *
 * Synchronized and recursive filesystem scanner
 *
 */

const fs = require('fs');

const walkSync = function(dir, filelist)
{
    if (dir[dir.length - 1] != '/')
    {
        dir = dir.concat('/');
    }

    var files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach(function(file)
    {
        if (fs.statSync(dir + file).isDirectory())
        {
            filelist = walkSync(dir + file + '/', filelist);
        }

        else
        {
            filelist.push(dir + file);
        }
    });

    return filelist;
};

module.exports = walkSync;
