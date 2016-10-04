/*****************************************************************************************
 * node-standardpaths
 *****************************************************************************************
 * Receive common operating system standard paths
 *
 * This project is an attempt to bring QStandardPaths from the Qt Project
 * to JavaScript and Node.
 *
 * There is a neat feature: It is possible to skip environment variable resolving and
 * return the path with the environment variables.
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

function xdg_config_home(resolve_path)
{
    if (os != 'win32')
    {
        if (env['XDG_CONFIG_HOME'])
        {
            return (resolve_path ? env['XDG_CONFIG_HOME'] : "$XDG_CONFIG_HOME");
        }

        else
        {
            return (resolve_path ? path.join(env['HOME'], ".config") : path.join(homePath(resolve_path), "/.config"));
        }
    }
}

function homePath(resolve_path)
{
    var HOME = resolve_path ? env['HOME'] : '$HOME';
    var USER = resolve_path ? env['USER'] : '$USER';
    var SYSTEMDRIVE = resolve_path ? env['SYSTEMDRIVE'] : '%SYSTEMDRIVE%';
    var USERPROFILE = resolve_path ? env['USERPROFILE'] : '%USERPROFILE%';
    var HOMEPATH = resolve_path ? env['HOMEPATH'] : '%HOMEPATH%';

    switch (os)
    {
        // $HOME, fallbacks to /home/$USER (may be wrong)
        case 'darwin':
        case 'freebsd':
        case 'linux':
        case 'sunos':
            return (HOME ? HOME : path.join("/home", USER));
            break;

        // %USERPROFILE%, fallbacks to %SYSTEMDRIVE%/%HOMEPATH%
        case 'win32':
            return (USERPROFILE ? USERPROFILE : path.join(SYSTEMDRIVE, HOMEPATH));
            break;
    }
}

function configLocation(resolve_path)
{
    var XDG_CONFIG_HOME = xdg_config_home(resolve_path);
    var LOCALAPPDATA = resolve_path ? env['LOCALAPPDATA'] : '%LOCALAPPDATA%';

    switch (os)
    {
        // ~/Library/Preferences
        case 'darwin':
            return path.join(homePath(), "Library", "Preferences");
            break;

        // $XDG_CONFIG_HOME, fallback ~/.confg
        case 'freebsd':
        case 'linux':
        case 'sunos':
            return (XDG_CONFIG_HOME ? XDG_CONFIG_HOME : path.join(homePath(resolve_path), ".config"));
            break;

        // %LOCALAPPDATA%, fallbacks to {HomePath}/AppData/Local
        case 'win32':
            return (LOCALAPPDATA ? LOCALAPPDATA : path.join(homePath(resolve_path), "AppData", "Local"));
            break;
    }
}

function systemConfigLocation(resolve_path)
{
    var SYSTEMDRIVE = resolve_path ? env['SYSTEMDRIVE'] : '%SYSTEMDRIVE%';

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
            return path.join(SYSTEMDRIVE, "ProgramData");
            break;
    }
}

module.exports = {

    // Named Path IDs
    HomePath: 0,
    ConfigLocation: 1,
    SystemConfigLocation: 2,

    // Returns the path for the given ID or undefined if not found
    path: function(id, resolve_path)
    {
        if (typeof id != "number") return;
        resolve_path = (typeof resolve_path == "boolean" && !resolve_path) ? false : true;

        switch (id)
        {
            case 0: return homePath(resolve_path); break;
            case 1: return configLocation(resolve_path); break;
            case 2: return systemConfigLocation(resolve_path); break;
        }
    }
};
