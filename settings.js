/* Music Console
 * @settings.js
 *
 * User Settings Manager
 *
 */

// local objects
var xdg = require('xdg').basedir;

var method = SettingsManager.prototype;

function SettingsManager()
{
    this.dir = xdg.configPath(global.pjson.author + "/" + global.pjson.name);
}

method.directory = function()
{
    return this.dir;
}

module.exports = SettingsManager;
