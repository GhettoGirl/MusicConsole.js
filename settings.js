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
    this.m_dir = xdg.configPath(global.pjson.author + "/" + global.pjson.name);

    mkdirp.sync(this.m_dir);

    try
    {
        fs.accessSync(this.m_dir, fs.F_OK);
    }

    catch (error)
    {
        console.error("Unable to create/access config directory: " + this.m_dir);
    }
}

method.directory = function()
{
    return this.m_dir;
}

module.exports = SettingsManager;
