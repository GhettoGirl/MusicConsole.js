/* Music Console
 * @search.js
 *
 * Command: search
 * searches the media library for the given search term
 * takes type filters
 *
 */

const FilterCommand = require('sys/filtercommand.js');

const Command = require('sys/command.js');

function CmdSearch(name)
{
    Command.call(this, name);
}

CmdSearch.prototype = Object.create(Command.prototype);
CmdSearch.prototype = {

execute: function(args)
{
    var filter = FilterCommand(args);

    if (filter.command == '')
    {
        console.log("No search terms.");
        return;
    }

    var results = medialib.findMultiple(filter.command, filter.type);

    if (results.length == 0)
    {
        console.log("No results found.");
        return;
    }

    for (const i of results)
    {
        i.print();
    }
}

} // prototype

module.exports = CmdSearch;
