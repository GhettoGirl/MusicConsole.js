/* Music Console
 * @settings.js
 *
 * User Settings Manager
 *
 */

// local objects
var xdg = require('xdg').basedir;
var mkdirp = require('mkdirp');
var fs = require('fs');

var method = SettingsManager.prototype;

function SettingsManager()
{
    this.dir = xdg.configPath(global.pjson.author + "/" + global.pjson.name);

    mkdirp.sync(this.dir);

    try
    {
        fs.accessSync(this.dir, fs.F_OK);
    }

    catch (error)
    {
        console.error("Unable to create/access config directory: " + this.dir);
    }
}

method.directory = function()
{
    return this.dir;
}

module.exports = SettingsManager;
