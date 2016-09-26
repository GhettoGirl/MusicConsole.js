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
 */

const validator = require('./validator.js');

// MediaFile(location, check, base_path, audiotypes, videotypes, moduletypes)
const MediaFile = require('lib/medialibrarymodel/mediafile.js');
var medialist = [];

// creates a MediaFile object from the given file
// returns either a string with the error occurred or the constructed MediaFile object
function create_mediafile_from_file(file)
{
}

// clear the generated medialist to free resources
function clear()
{
    medialist.length = 0;
}

// parse the playlist file
function parse(file)
{
}

module.exports = {
    parse,
    clear
};
