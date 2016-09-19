/* SearchTermGen
 * @latin.js
 *
 * Creates a latin-1 and widelatin variation of the input
 *
 */

const SearchTermGen = require('./searchtermgen.js');

function LatinGen()
{
    SearchTermGen.call(this);
}

LatinGen.prototype = Object.create(SearchTermGen.prototype);
LatinGen.prototype = {

generate: function(input)
{
    return [];
},

// checks is character is of type latin-1
isLatin1: function()
{
    return false;
},

// checks if character is of type widelatin
isWideLatin: function()
{
    return false;
}

} // prototype

module.exports = LatinGen;
