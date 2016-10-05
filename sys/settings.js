/* Music Console
 * @settings.js
 *
 * User Settings Manager
 *
 */

const standardpaths = require('node-standardpaths');
const path = require("path");
const fs = require('fs');
const mkdirp = require('extern/node-mkdirp');
const jsonfile = require('jsonfile');
const touch = require('extern/node-touch');
const resolve_env = require('utils/resolve-env.js');
const _ = require('extern/lodash');

const method = SettingsManager.prototype;

function SettingsManager()
{
    this.m_dir = path.join(standardpaths.path(standardpaths.ConfigLocation),
                           global.pjson.author, global.pjson.name);

    this.m_file = this.m_dir + "/settings.json";
    this.m_file_players = this.m_dir + "/players.json";

    // attempt to create the settings directory
    mkdirp.sync(this.m_dir);

    // make sure the config directory exists and is readable
    try
    {
        fs.accessSync(this.m_dir, fs.F_OK);
    }

    catch (error)
    {
        console.error("SettingsManager: " + error.name + ": " + error.message);
        console.error("Unable to create/access config directory: " + this.m_dir);
        return;
    }

    // make sure a file exists
    touch(this.m_file);
    touch(this.m_file_players);

    // create default settings
    this.m_settings = {
        commands: {
            audio: "audio",
            video: "video",
            module: "module",
            search: "search",
            browse: "browse",
            random: "random",
            shuffle: "shuffle",
            repeat: "repeat",
            history: "history",
            statistics: "statistics",
            rescan: "rescan",
            playlist: "playlist",
            plistfile: "plistfile",
            clear: "clear",
            exit: "exit"
        },
        library: {
            rootpath: standardpaths.path(standardpaths.HomePath, false), // scan the whole users home directory by default
            playlist_paths: [
                "$MUSICCONSOLE_CONFIG_DIR/playlists"
            ],
            prefixdeletionpatterns: ["Music/", "Video/", "Videos/"],
            audioformats: ["wav", "flac", "tta",  "aiff", "ape",  "pcm", "alac", "dts",
                           "m4a", "ogg",  "mka",  "wma",  "asf",  "ra",  "aac",  "mp3"],
            videoformats: ["mp4", "h264", "h263", "ts",   "m2ts", "mov", "ogm",  "avi",
                           "bk2", "bnk",  "mkv",  "wmv",  "rv"],
            moduleformats: ["xm", "it", "mod", "med", "sid", "s3m"]
        },
        player: {
            audioplayer: {
                command: "mplayer",
                arguments: [
                    "-novideo",
                    "-really-quiet",
                    "%f"
                ]
            },
            videoplayer: {
                command: "mpv",
                arguments: [
                    "-fs",
                    "-really-quiet",
                    "%f"
                ]
            },
            modplayer: {
                command: "xmp",
                arguments: []
            }
        },
        appearance: { // will be eval()-ed, reset happens automatically
            extension: "\\x1b[1;38;2;0;97;167m"
                     + "[%s]",
            artist:    "\\x1b[3m"
                     + "%s",
            album:     "\\x1b[4m"
                     + "%s",
            title:     "\\x1b[1m"
                     + "%s",
            genre:   "%s",
            path:    "%s",

            print_tagged: "$extension $artist $title $album",
            print_path:   "$extension $path"
        },
        tools: {
            browser: {
                command: "mc",
                arguments: [
                    "%d"
                ]
            }
        },
        prompt: {
            line: "# ",
            histignore: ["^statistics.*$", "^browse.*$", "^exit$", "^rescan.*$", "^history.*$", "^clear.*$"],
            histignore_size: 1
        },
        randomizer: {
            historysize: 2
        }
    };

    // copy settings
    this.m_default_settings = this.m_settings;

    try
    {
        this.m_settings = jsonfile.readFileSync(this.m_file);
        this.validateSettings();
    }

    catch (error)
    {
        jsonfile.writeFileSync(this.m_file, this.m_settings, {spaces: 2});
        this.m_settings = this.m_default_settings;
    }

    // create histignore regex array
    this.m_histignore = [];
    for (const i of this.m_settings.prompt.histignore)
    {
        this.m_histignore.push(new RegExp(i, 'i'));
    }

    // players.json
    try
    {
        this.m_players = jsonfile.readFileSync(this.m_file_players);
        this.m_players_valid = true;
    }

    catch (error)
    {
        if (fs.readFileSync(this.m_file_players) == '')
        {
            // write example file
            const example = {
                "extension": {
                    "command": "your_player",
                    "arguments": [
                        "%f"
                    ]
                }
            };

            jsonfile.writeFileSync(this.m_file_players, example, {spaces: 2});
        }

        else
        {
            console.error("Settings: players.json has syntax errors!");
        }

        this.m_players_valid = false;
    }
}

method.resolveEnvVariables = function()
{
    // resolve environment variables in [library.rootpath]
    this.m_settings.library.rootpath = resolve_env(this.m_settings.library.rootpath);
    this.m_default_settings.library.rootpath = this.m_settings.library.rootpath;

    // resolve variables in [library.playlist_paths]
    for (const i in this.m_settings.library.playlist_paths)
    {
        // $MUSICCONSOLE_CONFIG_DIR is an internal variable
        this.m_settings.library.playlist_paths[i] =
            jsext.String.replaceAll(this.m_settings.library.playlist_paths[i],
                                    "\\$MUSICCONSOLE_CONFIG_DIR", this.m_dir);

        // resolve all other environment variables
        this.m_settings.library.playlist_paths[i] = resolve_env(this.m_settings.library.playlist_paths[i]);
    }
    this.m_default_settings.library.playlist_paths = this.m_settings.library.playlist_paths;
}

// tries to find a player override for the given filetype
// returns either a object of '{command: "", arguments: []}'
// or undefined
method.findPlayerForFiletype = function(filetype)
{
    if (!this.m_players_valid || typeof filetype != "string" || filetype == '')
    {
        return;
    }

    if (filetype in this.m_players)
    {
        if (typeof this.m_players[filetype].command == "string" &&
            typeof this.m_players[filetype].arguments == "object")
        {
            return this.m_players[filetype];
        }
    }
}

// changes an field within the settings
method.set = function(key, value)
{
    _.set(this.m_settings, key, value);
}

// write the settings file back to a file
method.save = function()
{
    jsonfile.writeFileSync(this.m_file, this.m_settings, {spaces: 2});
}

method.isValidCommand = function(cmd)
{
    return RegExp("^(audio|video|module|search|browse|random|shuffle|repeat" +
                  "|history|statistics|rescan|playlist|plistfile|clear|exit)$",
                  'g').test(cmd);
}

// settings manager
method.manager = function(args)
{
    const isValid = function(option)
    {
        return (option && option != '');
    };

    if (isValid(args["library-path"]))
    {
        this.set("library.rootpath", args["library-path"]);
    }

    if (isValid(args["command"]))
    {
        var commands = args["command"].split(',');
        for (const i of commands)
        {
            var cmd = i.split('=');

            if (!this.isValidCommand(cmd[0]))
            {
                console.warn("warning: %s skipped, because its not a valid command.", cmd[0]);
                continue;
            }

            if (cmd.length != 2)
            {
                console.warn("warning: %s skipped, because its argument was empty.", cmd[0]);
                continue;
            }

            cmd[0] = cmd[0].trim();
            cmd[1] = cmd[1].trim();

            this.set("commands." + cmd[0], cmd[1]);
        }
    }

    this.save();
}

method.managerTest = function(args)
{
    console.log(args);
}

////////////////////////////////////////////
///                                      ///
/// FIXME!! simplify this asap !         ///
///                                      ///
////////////////////////////////////////////
method.validateSettings = function()
{
    const isObject = function(obj)
    {
        return (typeof obj == "object");
    };

    const isString = function(obj)
    {
        return (typeof obj == "string");
    };

    const isNumber = function(num)
    {
        return (typeof num == "number");
    };

    if (!isObject(this.m_settings.commands))
        this.m_settings.commands = this.m_default_settings.commands;
    if (!isObject(this.m_settings.library))
        this.m_settings.library = this.m_default_settings.library;
    if (!isObject(this.m_settings.player))
        this.m_settings.player = this.m_default_settings.player;
    if (!isObject(this.m_settings.appearance))
        this.m_settings.appearance = this.m_default_settings.appearance;
    if (!isObject(this.m_settings.tools))
        this.m_settings.tools = this.m_default_settings.tools;
    if (!isObject(this.m_settings.history))
        this.m_settings.history = this.m_default_settings.history;
    if (!isObject(this.m_settings.randomizer))
        this.m_settings.randomizer = this.m_default_settings.randomizer;

    if (!isString(this.m_settings.commands.audio))
        this.m_settings.commands.audio = this.m_default_settings.commands.audio;
    if (!isString(this.m_settings.commands.video))
        this.m_settings.commands.video = this.m_default_settings.commands.video;
    if (!isString(this.m_settings.commands.module))
        this.m_settings.commands.module = this.m_default_settings.commands.module;
    if (!isString(this.m_settings.commands.playlist))
        this.m_settings.commands.playlist = this.m_default_settings.commands.playlist;
    if (!isString(this.m_settings.commands.search))
        this.m_settings.commands.search = this.m_default_settings.commands.search;
    if (!isString(this.m_settings.commands.browse))
        this.m_settings.commands.browse = this.m_default_settings.commands.browse;
    if (!isString(this.m_settings.commands.random))
        this.m_settings.commands.random = this.m_default_settings.commands.random;
    if (!isString(this.m_settings.commands.shuffle))
        this.m_settings.commands.shuffle = this.m_default_settings.commands.shuffle;
    if (!isString(this.m_settings.commands.repeat))
        this.m_settings.commands.repeat = this.m_default_settings.commands.repeat;
    if (!isString(this.m_settings.commands.history))
        this.m_settings.commands.history = this.m_default_settings.commands.history;
    if (!isString(this.m_settings.commands.statistics))
        this.m_settings.commands.statistics = this.m_default_settings.commands.statistics;
    if (!isString(this.m_settings.commands.exit))
        this.m_settings.commands.exit = this.m_default_settings.commands.exit;
    if (!isString(this.m_settings.commands.clear))
        this.m_settings.commands.clear = this.m_default_settings.commands.clear;
    if (!isString(this.m_settings.commands.rescan))
        this.m_settings.commands.rescan = this.m_default_settings.commands.rescan;
    if (!isString(this.m_settings.commands.plistfile))
        this.m_settings.commands.plistfile = this.m_default_settings.commands.plistfile;

    if (!isString(this.m_settings.library.rootpath))
        this.m_settings.library.rootpath = this.m_default_settings.library.rootpath;
    if (!isObject(this.m_settings.library.playlist_paths))
        this.m_settings.library.playlist_paths = this.m_default_settings.library.playlist_paths;
    if (!isObject(this.m_settings.library.prefixdeletionpatterns))
        this.m_settings.library.prefixdeletionpatterns = this.m_default_settings.library.prefixdeletionpatterns;
    if (!isObject(this.m_settings.library.audioformats))
        this.m_settings.library.audioformats = this.m_default_settings.library.audioformats;
    if (!isObject(this.m_settings.library.videoformats))
        this.m_settings.library.videoformats = this.m_default_settings.library.videoformats;
    if (!isObject(this.m_settings.library.moduleformats))
        this.m_settings.library.moduleformats = this.m_default_settings.library.moduleformats;

    if (!isObject(this.m_settings.player.audioplayer))
        this.m_settings.player.audioplayer = this.m_default_settings.player.audioplayer;
    if (!isObject(this.m_settings.player.videoplayer))
        this.m_settings.player.videoplayer = this.m_default_settings.player.videoplayer;
    if (!isObject(this.m_settings.player.modplayer))
        this.m_settings.player.modplayer = this.m_default_settings.player.modplayer;

    if (!isString(this.m_settings.player.audioplayer.command))
        this.m_settings.player.audioplayer.command = this.m_default_settings.player.audioplayer.command;
    if (!isObject(this.m_settings.player.audioplayer.arguments))
        this.m_settings.player.audioplayer.arguments = this.m_default_settings.player.audioplayer.arguments;
    if (!isString(this.m_settings.player.videoplayer.command))
        this.m_settings.player.videoplayer.command = this.m_default_settings.player.videoplayer.command;
    if (!isObject(this.m_settings.player.videoplayer.arguments))
        this.m_settings.player.videoplayer.arguments = this.m_default_settings.player.videoplayer.arguments;
    if (!isString(this.m_settings.player.modplayer.command))
        this.m_settings.player.modplayer.command = this.m_default_settings.player.modplayer.command;
    if (!isObject(this.m_settings.player.modplayer.arguments))
        this.m_settings.player.modplayer.arguments = this.m_default_settings.player.modplayer.arguments;

    if (!isString(this.m_settings.appearance.extension))
        this.m_settings.appearance.extension = this.m_default_settings.appearance.extension;
    if (!isString(this.m_settings.appearance.artist))
        this.m_settings.appearance.artist = this.m_default_settings.appearance.artist;
    if (!isString(this.m_settings.appearance.album))
        this.m_settings.appearance.album = this.m_default_settings.appearance.album;
    if (!isString(this.m_settings.appearance.title))
        this.m_settings.appearance.title = this.m_default_settings.appearance.title;
    if (!isString(this.m_settings.appearance.genre))
        this.m_settings.appearance.genre = this.m_default_settings.appearance.genre;
    if (!isString(this.m_settings.appearance.path))
        this.m_settings.appearance.path = this.m_default_settings.appearance.path;
    if (!isString(this.m_settings.appearance.print_tagged))
        this.m_settings.appearance.print_tagged = this.m_default_settings.appearance.print_tagged;
    if (!isString(this.m_settings.appearance.print_path))
        this.m_settings.appearance.print_path = this.m_default_settings.appearance.print_path;

    if (!isObject(this.m_settings.tools.browser))
        this.m_settings.tools.browser = this.m_default_settings.tools.browser;
    if (!isString(this.m_settings.tools.browser.command))
        this.m_settings.tools.browser.command = this.m_default_settings.tools.browser.command;
    if (!isObject(this.m_settings.tools.browser.arguments))
        this.m_settings.tools.browser.arguments = this.m_default_settings.tools.browser.arguments;

    if (!isString(this.m_settings.prompt.line))
        this.m_settings.prompt.line = this.m_default_settings.prompt.line;
    if (!isObject(this.m_settings.prompt.histignore))
        this.m_settings.prompt.histignore = this.m_default_settings.prompt.histignore;
    if (!isNumber(this.m_settings.prompt.histignore_size))
        this.m_settings.prompt.histignore_size = this.m_default_settings.prompt.histignore_size;

    if (!isNumber(this.m_settings.randomizer.historysize))
        this.m_settings.randomizer.historysize = this.m_default_settings.randomizer.historysize;

    jsonfile.writeFileSync(this.m_file, this.m_settings, {spaces: 2});
}

method.directory = function()
{
    return this.m_dir;
}

method.commands = function()
{
    return this.m_settings.commands;
}

method.library = function()
{
    return this.m_settings.library;
}

method.player = function()
{
    return this.m_settings.player;
}

method.appearance = function()
{
    return this.m_settings.appearance;
}

method.tools = function()
{
    return this.m_settings.tools;
}

method.prompt = function()
{
    return this.m_settings.prompt;
}

method.randomizer = function()
{
    return this.m_settings.randomizer;
}

method.histignore = function()
{
    return this.m_histignore;
}

module.exports = SettingsManager;
