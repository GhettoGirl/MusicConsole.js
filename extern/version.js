/* Software Versioning Scheme Parser for NodeJS
 *
 * This file is part of my custom software versioning scheme.
 * Read more about it at
 * "github.com/GhettoGirl/common/blob/master/docs/Software Versioning Scheme.md"
 *
 * Licensed under the MIT license.
 *
 * MIT License
 *
 * Copyright © 2016 GhettoGirl
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

// Usage:
//  var pkg_version = require('version.js');
//  global.pkg_version = new pkg_version();
//
//  .version     receive the full version string [n.nn-n(n...)]
//  .main        receive the main number as integer
//  .progress    receive the progress number as integer
//  .revision    receive the revision number as integer

const path = require('path');
const app_dir = path.dirname(require.main.filename);
const pjson = require(app_dir + "/package.json");

function pkg_version_error(msg)
{
    console.error("version: " + msg);
}

var method = pkg_version.prototype;

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
