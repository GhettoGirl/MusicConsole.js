/* Music Console
 * @audio.js
 *
 * Command: audio
 * filter by audio files, play in audio player
 *
 */

const Command = require('sys/command.js');

function CmdAudio(name)
{
    Command.call(this, name);
}

CmdAudio.prototype = Object.create(Command.prototype);
CmdAudio.prototype = {

execute: function(args)
{
    var result = medialib.find(args, MediaType.Audio);
    if (typeof result != "undefined")
    {
        mediaplayer.execute(result);
    }

    else
    {
        console.log("No media found.");
    }
}

} // prototype

module.exports = CmdAudio;
