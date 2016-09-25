/* Music Console
 * @filtercommand.js
 *
 * Filter Command: audio, video, module
 * for commands which has media type filters
 *
 */

const cmd_audio = global.settings.commands().audio;
const cmd_video = global.settings.commands().video;
const cmd_module = global.settings.commands().module;

module.exports = function(command)
{
    if (command.startsWith(cmd_audio))
    {
        return (cmd_audio[cmd_audio.length + 1] == "undefined") ?
        {
            "command": '',
            type: MediaType.Audio
        }
        :
        {
            "command": command.substr(cmd_audio.length + 1),
            type: MediaType.Audio
        };
    }

    else if (command.startsWith(cmd_video))
    {
        return (cmd_video[cmd_video.length + 1] == "undefined") ?
        {
            "command": '',
            type: MediaType.Video
        }
        :
        {
            "command": command.substr(cmd_video.length + 1),
            type: MediaType.Video
        };
    }

    else if (command.startsWith(cmd_module))
    {
        return (cmd_module[cmd_module.length + 1] == "undefined") ?
        {
            "command": '',
            type: MediaType.ModuleTracker
        }
        :
        {
            "command": command.substr(cmd_module.length + 1),
            type: MediaType.ModuleTracker
        };
    }

    else
    {
        return {
            "command": command,
            type: MediaType.None
        };
    }
}
