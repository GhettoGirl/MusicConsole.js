/* MediaPlayerController
 * @controller.js
 *
 * Media Player Controller
 *
 * %f is replaced by the media file
 *
 */

const MediaType = require('lib/medialibrarymodel').MediaType;
const exec = require('child_process').spawnSync;

function named_mediatype(mediatype)
{
    switch (mediatype)
    {
        case MediaType.None:
            return "None";
            break;

        case MediaType.Audio:
            return "Audio";
            break;

        case MediaType.Video:
            return "Video";
            break;

        case MediaType.ModuleTracker:
            return "ModuleTracker";
            break;
    }
}

function named_exec_error(results)
{
    console.error("MediaPlayerController: Failed to execute '%s'! Reason: %s\n" +
                  "    Arguments:", // let Node print the array as is
        results.error.path,
        results.error.code,
        results.error.spawnargs);
}

const method = MediaPlayerController.prototype;

function MediaPlayerController()
{
    this.m_players = [];
}

// sets the player for the given media type
// the player must be an object of '{command: "", arguments: []}'
// the arguments should contain a string of '%f' if the media file
// should not be the last argument
method.setPlayerForMediatype = function(mediatype, player)
{
    if (typeof mediatype != "number" || typeof player != "object" ||
       typeof player.command != "string" || typeof player.arguments != "object" ||
       mediatype == MediaType.None)
    {
        return false;
    }

    var overridden = false;

    // override existing player
    for (const i in this.m_players)
    {
        if (this.m_players[i].type == mediatype)
        {
            this.m_players[i] = {
                type: mediatype,
                command: player.command,
                arguments: player.arguments
            };
            overridden = true;
            break;
        }
    }

    // append new player if not overridden before
    if (!overridden)
    {
        this.m_players.push({
            type: mediatype,
            command: player.command,
            arguments: player.arguments
        });
    }

    return true;
}

// returns the player for the given media type or the audio player on [None]
method.playerForMediatype = function(mediatype)
{
    if (typeof mediatype != "number" || mediatype == MediaType.None)
    {
        for (const player of this.m_players)
        {
            if (player.type == MediaType.Audio)
            {
                return player;
            }
        }
    }

    for (const player of this.m_players)
    {
        if (mediatype == player.type)
        {
            return player;
        }
    }
}

// sets the player for the given filetype
// the player must be an object of '{command: "", arguments: []}'
// the arguments should contain a string of '%f' if the media file
// should not be the last argument
method.setPlayerForFiletype = function(filetype, player)
{
    if (typeof filetype != "string" || typeof player != "object" ||
       typeof player.command != "string" || typeof player.arguments != "object" ||
       filetype == '')
    {
        return false;
    }

    var overridden = false;

    // override existing player
    for (const i in this.m_players)
    {
        if (this.m_players[i].type == filetype)
        {
            this.m_players[i] = {
                type: filetype,
                command: player.command,
                arguments: player.arguments
            };
            overridden = true;
            break;
        }
    }

    // append new player if not overridden before
    if (!overridden)
    {
        this.m_players.push({
            type: filetype,
            command: player.command,
            arguments: player.arguments
        });
    }

    return true;
}

// returns the player for the given filetype or undefined
method.playerForFiletype = function(filetype)
{
    if (typeof filetype != "string" || filetype == '')
    {
        return;
    }

    for (const player of this.m_players)
    {
        if (filetype == player.type)
        {
            return player;
        }
    }
}

// executes the media player synchronously and waits until the player closed
// stdio is owned by the player in the meantime
// which means stdout, stderr and stdin works just fine :)
//
// mediatype allows to enforce one of the standard players
//
// returns the exit code of the process on success
// otherwise returns -1
method.execute = function(mediafile, mediatype)
{
    // basic MediaFile checking
    if (typeof mediafile != "object" ||
        typeof mediafile.m_extension == "undefined" ||
        typeof mediafile.m_path == "undefined")
    {
        console.error("MediaPlayerController: TypeError: given argument is not a MediaFile object");
        return -1;
    }

    var player;

    // Player Enforcement
    if (typeof mediatype == "number")
    {
        player = this.playerForMediatype(mediatype);
        if (typeof player == "undefined")
        {
            return -1;
        }
    }

    // Filetype-based Player
    else
    {
        player = this.playerForFiletype(mediafile.m_extension);
        if (typeof player == "undefined")
        {
            return -1;
        }
    }

    // Replace %f in argument list or append location if not existent
    var args = player.arguments;
    var f_index = args.indexOf('%f');
    if (f_index != -1)
    {
        args[f_index] = mediafile.m_path;
    }

    else
    {
        args.push(mediafile.m_path);
    }

    mediafile.print();
    var results = exec(player.command, args, {stdio: 'inherit'});
    args.length = 0;

    if (typeof results.error != "undefined")
    {
        named_exec_error(results);
        return -1;
    }

    return results.status;
}

module.exports = MediaPlayerController;
