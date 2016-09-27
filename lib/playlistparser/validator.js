/* PlaylistParser
 * @validator.js
 *
 * Syntax checker and minifier
 * Returns either true or false and a minified version of the playlist
 *
 * Checks the syntax so that the parser can do its work.
 * Takes only an array of strings, the parser reads the file and sends it to the validator first.
 * Returns a minified version of the playlist on success containing only the interesting
 * lines so that the parser doesn't need to do this anymore.
 * Empty lines are kept for warning purposes on the parser side.
 *
 * Return: [bool, array of strings]
 *
 * ××× Reporting ×××
 *
 * The syntax checker remembers line and column numbers where the error occurred to help the
 * user to find the problem in the playlist file.
 * There is experimental support for a visual indicator (^) which is shown under the
 * problematic position of each line on the output. Experimental as-in the position is a bit off on several
 * scenarios.
 *
 * ××× Syntax ××××
 *
 * | MUSICCONSOLE PLAYLIST           | header, must be the first line, indicates a playlist file
 * | # my playlist                   | lines starting with a hash are comments
 * |                                 | comments can be also appened to existing lines
 * |                                 | empty lines or lines containing just spaces are always ignored
 * |                                 | unicode spaces (like U+3000) are supported, means they are ignored too
 * |                                 |
 * | "this is a string"              | strings
 * | "this is 'also' a \"string\""   | double quotes inside strings must be escaped to be recognized,
 * |                                 | otherwise the string ends early and the characters after the
 * |                                 | string can trigger a sytnax error (depends on the situation)
 * | 'this is another string'        | strings can also be defined using single quotes
 * | 'this "works" now'              | double quotes are now valid inside single quote strings
 * | 'now \' must be escaped'        | now you need escape the single quote character
 * |                                 |
 * | T:"string"                      | T = type, single upper-case character
 * | T:"string" player               | "string"
 * |                                 | player = optimal, regular word outside of quotes
 * | R:T:"string" (player)           | type of R(random)
 *
 *
 *
 */

/* notes
 *
 * all these regular expressions are random findings from the internet
 * i don't understand regex and i'm to lazy to learn them :(
 *
 * fixme: merge this into one universal regular expression
 *        aka. the ultimate string matcher
 * "((?:\\.|[^"\\])*)"            <- capture double quote strings, respects escaped double quotes
 * '((?:\\.|[^'\\])*)'            <- capture single quote strings, respects escaped single quotes
 *
 * ^[^"']*                        <- capture everything until the first quote, or everything if no quote exists
 * [^\s]                          <- capture everything which is not a whitespace
 *
 * .*"(.*)$ , .*'(.*)$            <- capture everything after quotes, fixme: change this to match only after last oc.
 *
 * captures comments (#), takes care not to capture the hash sign within single and double quotes
 * #(?=([^"\\'\\]*(\\.|"([^"\\'\\]*\\.)*[^"\\'\\]*"))*[^"]*$).*
 *
 * ^[AVMNFR]\:$|^[R]\:[AVM]:\$    <- ( doesn't work, because I don't understand regex :(
 * ^[AVMNFR]\:.*$                 <- matches all types followed by a colon followed by anything
 * ^[R]\:[AVMN]:.*$               <- matches R followed by supported R types followed by anything
 *
 * .search(/\S|$/)                <- count spaces from the beginning of a string
 *
 */

// forward declare function
var minify_line = undefined;

const regex_find_single_quoted_strings = /'((?:\\.|[^'\\])*)'/gm;
const regex_find_double_quoted_strings = /"((?:\\.|[^"\\])*)"/gm;

// returns the column number of the problematic character
// or '0' if the check succeed
// contains a message describing the error
//
// Return: [column, (error message) or (minified line)]
function validate_line(line)
{
    // trim the line for futher processing
    line = line.trim();

    // check if line is empty or starts with comment
    if (line == '' || line[0] == '#')
    {
        return [0, "", line];
    }

    // strip comments from the line, takes care not to remove "comments" inside strings
    line = line.replace(/#(?=([^"\\'\\]*(\\.|"([^"\\'\\]*\\.)*[^"\\'\\]*"))*[^"]*$).*/, '');

    // check if line starts with a supported type character (uppercase)
    if (!line.match(/^[AVMNFR]\:.*$/))
    {
        return [1, "Type must be one of [AVMNRF] followed by a colon, notice the uppercase.", line];
    }

    // on R type: check if supported subtype
    if (line[0] == 'R')
    {
        if (!line.match(/^[R]\:[AVMN]:.*$/))
        {
            return [3, "[R] takes only one of [AVMN] followed by a colon, notice the uppercase.", line];
        }
    }

    // create substring of line with types removed
    var sline = ( line[0] == 'R' ? line.substr(4) : line.substr(2) );
    var bcount = ( line[0] == 'R' ? 4 : 2 );

    // check if there is anything else but a string next, spaces are not checked
    var before_string = sline.match(/^[^"']*/);
    if (before_string[0] != '') // is never undefined
    {
        if (before_string[0].match(/[^\s]/g))
        {
            return [bcount, "Not a string. After the type you need to specify a string", line];
        }
    }

    // check for valid string and only ONE string
    var str_counter = 0;

    // (note by a C++ developer how learns JavaScript)
    // i don't know how javascript's memory management works, but without this 2 lines
    // the following happens:
    //   - when calling the function 2 times in a row with the exact same input
    //     the second call reports false results for no reason
    //     adding the 2 matches here seems to fix this :/
    // i hope i will find out someday why this happens and how javascript manages its memory
    sline.match(regex_find_double_quoted_strings);
    sline.match(regex_find_single_quoted_strings);

    // fixme: simplify this
    while (match = regex_find_double_quoted_strings.exec(sline))
    {
        str_counter++;
        if (str_counter > 1)
        {
            return [match.index, "Multiple strings found, please remove all but one string.", line];
        }
    }

    while (match = regex_find_single_quoted_strings.exec(sline))
    {
        str_counter++;
        if (str_counter > 1)
        {
            return [match.index, "Multiple strings found, please remove all but one string.", line];
        }
    }

    if (str_counter == 0)
    {
        return [bcount, "No string found, please add one.", line];
    }

    else if (str_counter > 1)
    {
        return [bcount, "Multiple strings found, please remove all but one string.", line];
    }

    // check if there is anything else but a player command next, spaces are not checked
    var command = sline.match(/.*"(.*)$/) || sline.match(/.*'(.*)$/);
    var cmd_index = sline.match(regex_find_double_quoted_strings) || sline.match(regex_find_single_quoted_strings);
    cmd_index = sline.indexOf(cmd_index) + cmd_index[0].length;
    command = sline.substr(cmd_index);
    if (command != '')
    {
        command = command.trim();
        if (command != "audio" &&
            command != "video" &
            command != "module" &&
            command != "")
        {
            return [cmd_index, "Unknown player, must be one of [audio, video, module] or empty.", line];
        }
    }

    return [0, minify_line(line), line];
}

minify_line = function(line)
{
    var str = line.match(regex_find_double_quoted_strings) || line.match(regex_find_single_quoted_strings);
    pos = line.indexOf(str);

    if (line.match(/^[AVMNF]\:.*$/))
    {
        line = line.substr(0, 2) + line.substr(pos);
    }

    else // [R]
    {
        line = line.substr(0, 4) + line.substr(pos);
    }

    pos = pos + str[0].length;

    if (line.length > pos)
    {
        line = line.substr(0, pos) + line.substr(pos).trim();
    }

    return line;
}

function validate(lines, filename)
{
    // check if empty
    if (lines.length == 0)
    {
        console.error("Error in playlist: " + filename);
        console.error(" -> File is empty.");
        return [false, []];
    }

    // validate header
    if (lines[0] != "MUSICCONSOLE PLAYLIST")
    {
        console.error("Error in playlist: " + filename);
        console.error(" -> Not a valid playlist, missing 'MUSICCONSOLE PLAYLIST' at top of file.");
        return [false, []];
    }

    var minified = [];

    // check all the other lines
    for (let i = 1; i < lines.length; i++)
    {
        var msg = validate_line(lines[i]);

        // report error
        if (msg[0] != 0)
        {
            console.error("Error in playlist: " + filename);
            console.error(" -> at %d:%d: '%s'", i + 1, msg[0], msg[2]); // fixme: investigate why the line number is wrong
            for (let j = 0; j < 10
                              + i.toString().length
                              + msg[0].toString().length
                              + msg[0]; j++)
                process.stderr.write(' ');
            process.stderr.write('^\n'); // draw visual indicator pointing at the problematic character
            console.error("    " + msg[1]);
            return [false, []];
        }

        else
        {
            minified.push(msg[1]);
        }
    }

    return [true, minified];
}

module.exports = validate;
