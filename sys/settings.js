/* Music Console
 * @settings.js
 *
 * User Settings Manager
 *
 */

const xdg = require('xdg').basedir;
const mkdirp = require('mkdirp');
const fs = require('fs');
const jsonfile = require('jsonfile');
const touch = require('../extern/node-touch');
const resolve_env = require('../extern/node-resolve-env');

const method = SettingsManager.prototype;

function SettingsManager()
{
    this.m_dir = xdg.configPath(global.pjson.author + "/" + global.pjson.name);
    this.m_file = this.m_dir + "/settings.json";

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

    // create default settings
    this.m_settings = {
        commands: {
            audio: "audio",
            video: "video",
            module: "module",
            playlist: "playlist",
            search: "search",
            browse: "browse",
            random: "random",
            shuffle: "shuffle",
            repeat: "repeat",
            history: "history",
            statistics: "statistics",
            exit: "exit",
            rescan: "rescan",
            playlist_fileload: "load"
        },
        library: {
            rootpath: "$HOME", // scan the whole users home directory by default
            prefixdeletionpatterns: ["Music/", "Video/", "Videos/"],
            audioformats: ["wav", "flac", "tta",  "aiff", "ape",  "pcm", "alac", "dts",
                           "m4a", "ogg",  "mka",  "wma",  "asf",  "ra",  "aac",  "mp3"],
            videoformats: ["mp4", "h264", "h263", "ts",   "m2ts", "mov", "ogm",  "avi",
                           "bk2", "bnk",  "mkv",  "wmv",  "rv"],
            moduleformats: ["xm", "it", "mod", "med", "sid", "s3m"]
        },
        player: {
            audioplayer: "mplayer -novideo -really-quiet %f",
            videoplayer: "mpv -fs -really-quiet %f",
            modplayer: "xmp"
        },
        tools: {
            browser: "mc",
        },
        history: {
            histignore: ["statistics.*", "browse.*", "exit.*", "rescan.*", "history.*"]
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

    // resolve environment variables in [library.rootpath]
    this.m_settings.library.rootpath = resolve_env(this.m_settings.library.rootpath);
    this.m_default_settings.library.rootpath = this.m_settings.library.rootpath;

    // create histignore regex array
    this.m_histignore = [];
    for (var i of this.m_settings.history.histignore)
    {
        this.m_histignore.push(new RegExp(i, 'i'));
    }
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

    if (!isObject(this.m_settings.commands))
        this.m_settings.commands = this.m_default_settings.commands;
    if (!isObject(this.m_settings.library))
        this.m_settings.library = this.m_default_settings.library;
    if (!isObject(this.m_settings.player))
        this.m_settings.player = this.m_default_settings.player;
    if (!isObject(this.m_settings.tools))
        this.m_settings.tools = this.m_default_settings.tools;
    if (!isObject(this.m_settings.history))
        this.m_settings.history = this.m_default_settings.history;

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
    if (!isString(this.m_settings.commands.rescan))
        this.m_settings.commands.rescan = this.m_default_settings.commands.rescan;
    if (!isString(this.m_settings.commands.playlist_fileload))
        this.m_settings.commands.playlist_fileload = this.m_default_settings.commands.playlist_fileload;

    if (!isString(this.m_settings.library.rootpath))
        this.m_settings.library.rootpath = this.m_default_settings.library.rootpath;
    if (!isObject(this.m_settings.library.prefixdeletionpatterns))
        this.m_settings.library.prefixdeletionpatterns = this.m_default_settings.library.prefixdeletionpatterns;
    if (!isObject(this.m_settings.library.audioformats))
        this.m_settings.library.audioformats = this.m_default_settings.library.audioformats;
    if (!isObject(this.m_settings.library.videoformats))
        this.m_settings.library.videoformats = this.m_default_settings.library.videoformats;
    if (!isObject(this.m_settings.library.moduleformats))
        this.m_settings.library.moduleformats = this.m_default_settings.library.moduleformats;

    if (!isString(this.m_settings.player.audioplayer))
        this.m_settings.player.audioplayer = this.m_default_settings.player.audioplayer;
    if (!isString(this.m_settings.player.videoplayer))
        this.m_settings.player.videoplayer = this.m_default_settings.player.videoplayer;
    if (!isString(this.m_settings.player.modplayer))
        this.m_settings.player.modplayer = this.m_default_settings.player.modplayer;

    if (!isString(this.m_settings.tools.browser))
        this.m_settings.tools.browser = this.m_default_settings.tools.browser;

    if (!isObject(this.m_settings.history.histignore))
        this.m_settings.history.histignore = this.m_default_settings.history.histignore;

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

method.tools = function()
{
    return this.m_settings.tools;
}

method.history = function()
{
    return this.m_settings.history;
}

method.histignore = function()
{
    return this.m_histignore;
}

module.exports = SettingsManager;
