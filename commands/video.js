/* Music Console
 * @video.js
 *
 * Command: video
 * filter by video files, play in video player
 *
 */

const Command = require('sys/command.js');

function CmdVideo(name)
{
    Command.call(this, name);
}

CmdVideo.prototype = Object.create(Command.prototype);
CmdVideo.prototype = {

execute: function(args)
{
    var result = medialib.find(args, MediaType.Video);
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

module.exports = CmdVideo;
