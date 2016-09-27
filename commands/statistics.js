/* Music Console
 * @CmdStatistics.js
 *
 * Command: statistics
 * prints results about the media library
 *
 */

const ansi = require('utils/termformat.js').ansi;
const tilde = require('utils/home-tilde.js');

const Command = require('sys/command.js');

function CmdStatistics(name)
{
    Command.call(this, name);
}

CmdStatistics.prototype = Object.create(Command.prototype);
CmdStatistics.prototype = {

execute: function(args)
{
    console.log(

        " ┌──── " + ansi.bold + "Library Paths" + ansi.reset + '\n' +
        " │" + '\n' +
        " ├─ Root Path:        " + tilde(medialib.path()) + '\n' +
        " ├─ Cache Path:       " + tilde(medialib.cachePath()) + '\n' +
        " │" + '\n' +
        " ├──── " + ansi.bold + "Media Types" + ansi.reset + '\n' +
        " │" + '\n' +
        " ├─ Audio: " + medialib.mediaTypes(MediaType.Audio) + '\n' +
        " ├─ Video: " + medialib.mediaTypes(MediaType.Video) + '\n' +
        " ├─ Module Tracker: " + medialib.mediaTypes(MediaType.ModuleTracker) + '\n' +
        " │" + '\n' +
        " ├──── " + ansi.bold + "Counters" + ansi.reset + '\n' +
        " │" + '\n' +
        " ├─ # of audio files:       " + medialib.count(MediaType.Audio) + '\n' +
        " ├─ # of video files:       " + medialib.count(MediaType.Video) + '\n' +
        " ├─ # of mod files:         " + medialib.count(MediaType.ModuleTracker) + '\n' +
        " │" + '\n' +
        " ├─ # of total media files: " + medialib.count() + '\n' +
        " │" + '\n' +
        ""
    );
}

} // prototype

module.exports = CmdStatistics;
