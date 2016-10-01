/*****************************************************************************************
 * node-standardpaths
 *****************************************************************************************
 * Receive common operating system standard paths
 *
 * This project is an attempt to bring QStandardPaths from the Qt Project
 * to JavaScript and Node.
 *
 *
 * Supported paths (so far):
 *
 *  × HomePath                  : users home directory
 *  × ConfigLocation            : user configuration directory
 *  × SystemConfigLocation      : system configuration directory
 *
 *
 *
 *****************************************************************************************
 * Copyright © 2016 GhettoGirl
 *
 * Licensed under MIT
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
 *****************************************************************************************/

const path = require('path');

const os = process.platform; // 'darwin', 'freebsd', 'linux', 'sunos', 'win32'
const env = process.env;

function homePath()
{
    switch (os)
    {
        // $HOME, fallbacks to /home/$USER (may be wrong)
        case 'darwin':
        case 'freebsd':
        case 'linux':
        case 'sunos':
            return (env['HOME'] ? env['HOME'] : path.join("/home", env['USER']));
            break;

        // %USERPROFILE%, fallbacks to %SYSTEMDRIVE%/%HOMEPATH%
        case 'win32':
            return (env['USERPROFILE'] ? env['USERPROFILE'] : path.join(env['SYSTEMDRIVE'], env['HOMEPATH']));
            break;
    }
}

function configLocation()
{
    switch (os)
    {
        // ~/Library/Preferences
        case 'darwin':
            return path.join(homePath(), "Library", "Preferences");
            break;

        // $XDG_CONFIG_DIR, fallback ~/.confg
        case 'freebsd':
        case 'linux':
        case 'sunos':
            return (env['XDG_CONFIG_DIR'] ? env['XDG_CONFIG_DIR'] : path.join(homePath(), ".config"));
            break;

        // %LOCALAPPDATA%, fallbacks to {HomePath}/AppData/Local
        case 'win32':
            return (env['LOCALAPPDATA'] ? env['LOCALAPPDATA'] : path.join(homePath(), "AppData", "Local"));
            break;
    }
}

function systemConfigLocation()
{
    switch (os)
    {
        // FIXME: where does macOS stores system configuration files??
        case 'darwin':
            break;

        // /etc
        case 'freebsd':
        case 'linux':
        case 'sunos':
            return "/etc";
            break;

        // %SYSTEMDRIVE%/ProgramData
        case 'win32':
            return path.join(env['SYSTEMDRIVE'], "ProgramData");
            break;
    }
}

module.exports = {

    // Named Path IDs
    HomePath: 0,
    ConfigLocation: 1,
    SystemConfigLocation: 2,

    // Returns the path for the given ID or undefined if not found
    path: function(id)
    {
        if (typeof id != "number")
        {
            return;
        }

        switch (id)
        {
            case 0: return homePath(); break;
            case 1: return configLocation(); break;
            case 2: return systemConfigLocation(); break;
        }
    }
};
