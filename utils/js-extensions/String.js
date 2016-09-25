/* js-extensions
 * @String.js
 *
 * Extensions for Strings
 *
 */

module.exports = {

// Replace character at the given index.
replaceAt: function(string, index, character)
{
    return string.substr(0, index) + character + string.substr(index + character.length);
},

// Replaces all occurrences in a string with a new one.
replaceAll: function(string, search, replacement)
{
    return string.replace(RegExp(search, 'g'), replacement);

    //replacement = replacement.replace(/\$/g,"$$$$");
    //return string.replace(RegExp(search.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g, "\\$&"), 'g'), replacement);
},

// Changes the content of a string by removing a range of
// characters and/or adding new characters.
splice: function(string, start, delCount, newSubStr)
{
    return string.slice(0, start) + newSubStr + string.slice(start + Math.abs(delCount));
}

};
