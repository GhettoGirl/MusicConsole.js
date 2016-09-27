/* PlaylistParser
 * @parser.js
 *
 * Parses the playlist file
 *
 * Returns a list of found media files
 * On 'F' (load file) a new MediaFile object is constructed
 *
 * When no media file is found for a given search term, or a file could not be found
 * or accessed, a warning is generated.
 * Warnings are generated per entry and contains the line number of the given file.
 *
 * Note: the header is removed so +1 to get the actual line number of the entry.
 *
 * Note: [F]: relative paths are relative to the home directory
 *
 */

const fs = require('fs');
const path = require('path');

const tilde = require('utils/home-tilde.js');

const validator = require('./validator.js');

// MediaFile(location, check, base_path, audiotypes, videotypes, moduletypes)
const MediaFile = require('lib/medialibrarymodel/mediafile.js');

var tmp_medialist = [];
var plist = [];

// creates a MediaFile object from the given file
// the created MediaFile is pushed to the temporary medialist
//
// if the given file is already part of the media library the
// corresponding MediaFile object is pushed to the playlist
//
// returns the following
// [bool, error message]
//   true on success, empty error message
//   false on failue, error message describing what happened
function create_mediafile_from_file(file, player)
{
    if (file == '')
    {
        return [false, "no file specified"];
    }

    try
    {
        fs.accessSync(file, fs.F_OK);
    }

    catch (error)
    {
        return [false, "file doesn't exists or couldn't be read"];
    }

    if (medialib.hasMediaForFile(file))
    {
        plist.push([medialib.getMediaForFile(file), player]);
    }

    else
    {
        var base_path = path.dirname(file);

        var mediafile = new MediaFile(file, false, base_path,
                                      medialib.mediaTypes(MediaType.Audio),
                                      medialib.mediaTypes(MediaType.Video),
                                      medialib.mediaTypes(MediaType.ModuleTracker));
        mediafile.init(medialib.prefixDeletionPatterns(), base_path);

        if (mediafile.m_path == '')
        {
            return [false, "couldn't construct a media file"];
        }

        tmp_medialist.push(mediafile);
        plist.push([tmp_medialist[tmp_medialist.length - 1], player]);
    }

    return [true, ""];
}

// destroys the temporary medialist to free resources
// and clears the playlist
function clear()
{
    tmp_medialist.length = 0;
    plist = [];
}

// returns the playlist
// [ [mediafile, player], ... ]
function playlist()
{
    return plist;
}

// parse a line, returns [type(s), string, player]
function parse_line(line)
{
    var type = line[0];
    var str_beg = 2, str_end = 0;

    if (type == 'R')
    {
        type = type + line[2];
        str_beg = 4;
    }

    if (line[str_beg] == '"')
    {
        str_end = line.lastIndexOf('"');
    }

    else
    {
        str_end = line.lastIndexOf("'");
    }

    var string = line.substr(str_beg, str_end - str_beg + 1);
    string = eval(string); // expand string

    return [type, string, line.substr(str_end + 1)];
}

// parse the playlist file and creates the playlist
// returns [error code]
// list of error codes
//   × 0 no error
//   × 1 file not found
//   × 2 not a valid playlist file or syntax error
function parse(file)
{
    // check for file existence
    try
    {
        fs.accessSync(file, fs.F_OK);
    }

    catch (error)
    {
        return 1;
    }

    // read lines into array and send to validator
    var lines = fs.readFileSync(file).toString().split(/[\n\r]/gm);
    var result = validator(lines, file);

    if (!result[0])
    {
        return 2;
    }

    // start to parse all the lines
    var i = 2;
    for (let line of result[1])
    {
        if (line == '')
        {
            i++;
            continue;
        }

        line = parse_line(line);

        var mediafile;

        switch (line[0][0])
        {

        // AUDIO
        case 'A':
            mediafile = medialib.find(line[1], MediaType.Audio);
            mediafile ? plist.push([mediafile, line[2]]) :
                console.log("warning: line %d: no song found for term: %s", i, line[1]);
            break;
        // END OF AUDIO

        // VIDEO
        case 'V':
            mediafile = medialib.find(line[1], MediaType.Video);
            mediafile ? plist.push([mediafile, line[2]]) :
                console.log("warning: line %d: no video found for term: %s", i, line[1]);
            break;
        // END OF VIDEO

        // MODULE
        case 'M':
            mediafile = medialib.find(line[1], MediaType.ModuleTracker);
            mediafile ? plist.push([mediafile, line[2]]) :
                console.log("warning: line %d: no mod found for term: %s", i, line[1]);
            break;
        // END OF MODULE

        // NONE
        case 'N':
            mediafile = medialib.find(line[1]);
            mediafile ? plist.push([mediafile, line[2]]) :
                console.log("warning: line %d: no media found for term: %s", i, line[1]);
            break;
        // END OF NONE

        // RANDOM
        case 'R':
            switch (line[0][1])
            {

            // RANDOM AUDIO
            case 'A':
                if (line[1] != '')
                {
                    mediafile = medialib.randomMediaFiltered(line[1], MediaType.Audio);
                    mediafile ? plist.push([mediafile, line[2]]) :
                        console.log("warning: line %d: no song found for term: %s", i, line[1]);
                }

                else
                {
                    mediafile = medialib.randomMedia(MediaType.Audio);
                    mediafile ? plist.push([mediafile, line[2]]) :
                        console.log("warning: line %d: no songs found in the library", i);
                }
                break;
            // END OF RANDOM AUDIO

            // RANDOM VIDEO
            case 'V':
                if (line[1] != '')
                {
                    mediafile = medialib.randomMediaFiltered(line[1], MediaType.Video);
                    mediafile ? plist.push([mediafile, line[2]]) :
                        console.log("warning: line %d: no video found for term: %s", i, line[1]);
                }

                else
                {
                    mediafile = medialib.randomMedia(MediaType.Video);
                    mediafile ? plist.push([mediafile, line[2]]) :
                        console.log("warning: line %d: no videos found in the library", i);
                }
                break;
            // END OF RANDOM VIDEO

            // RANDOM MODULE
            case 'M':
                if (line[1] != '')
                {
                    mediafile = medialib.randomMediaFiltered(line[1], MediaType.ModuleTracker);
                    mediafile ? plist.push([mediafile, line[2]]) :
                        console.log("warning: line %d: no mod found for term: %s", i, line[1]);
                }

                else
                {
                    mediafile = medialib.randomMedia(MediaType.ModuleTracker);
                    mediafile ? plist.push([mediafile, line[2]]) :
                        console.log("warning: line %d: no module tracker found in the library", i);
                }
                break;
            // END OF RANDOM MODULE

            // RANDOM [NONE]
            case 'N':
                if (line[1] != '')
                {
                    mediafile = medialib.randomMediaFiltered(line[1]);
                    mediafile ? plist.push([mediafile, line[2]]) :
                        console.log("warning: line %d: no media found for term: %s", i, line[1]);
                }

                else
                {
                    mediafile = medialib.randomMedia();
                    mediafile ? plist.push([mediafile, line[2]]) :
                        console.log("warning: line %d: no media found in the library", i);
                }
                break;
            // END OF RANDOM [NONE]

            }
            break;
        // END OF RANDOM

        // FILE
        case 'F':
            if (line[1] != '' && !path.isAbsolute(line[1]))
            {
                line[1] = path.join(process.env['HOME'], line[1]);
            }

            var results = create_mediafile_from_file(line[1], line[2]);
            if (!results[0])
            {
                console.log("warning: line: %d: %s: %s", i, results[1], tilde(line[1]));
            }
            break;
        // END OF FILE

        }

        i++;
    }

    return 0;
}

module.exports = {
    parse,
    playlist,
    clear
};
