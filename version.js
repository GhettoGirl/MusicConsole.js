/* Software Versioning Scheme Parser for NodeJS
 *
 * This file is part of my custom software versioning scheme.
 * Read more about it at
 * "github.com/GhettoGirl/common/blob/master/docs/Software Versioning Scheme.md"
 *
 * Licensed under the MIT license.
 *
 */

const path = require('path');
const app_dir = path.dirname(require.main.filename);
const pjson = require(app_dir + "/package.json");

function pkg_version_error(msg)
{
    console.error("version: " + msg);
}

const method = pkg_version.prototype;

function pkg_version()
{
    try
    {
        var ver = pjson.version.split('.');

        if (ver.length != 3)
        {
            pkg_version_error("No valid semantic version string found in package.json");
        }

        else
        {
            this.m_main = ver[0];

            if (ver[1].length != 1 && ver[2].length != 1)
            {
                pkg_version_error("Invalid version string");
            }

            else
            {
                this.m_progress = ver[1] + ver[2];
            }

            this.m_revision = pjson.revision;
        }
    }

    catch (error)
    {
        pkg_version_error("Failed to parse package.json");
    }
}

method.version = function()
{
    return this.m_main + "." + this.m_progress + "-" + this.m_revision;
}

method.main = function()
{
    return this.m_main;
}

method.progress = function()
{
    return this.m_progress;
}

method.revision = function()
{
    return this.m_revision;
}

module.exports = pkg_version;
