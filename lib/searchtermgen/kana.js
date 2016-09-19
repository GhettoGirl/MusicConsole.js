/* SearchTermGen
 * @kana.js
 *
 * Creates a hiragana, katakana and halfwidth-katakana variation of the input
 *
 */

const SearchTermGen = require('./searchtermgen.js');

function KanaGen()
{
    SearchTermGen.call(this);
}

KanaGen.prototype = Object.create(SearchTermGen.prototype);
KanaGen.prototype = {

generate: function(input)
{
    return [];
},

// checks if character is a hiragana
isHiragana: function()
{
    return false;
},

// checks if character is a katakana
isKatakana: function()
{
    return false;
},

// checks if character is a halfwidth-katakana
isHalfwidth: function()
{
    return false;
}

} // prototype

module.exports = KanaGen;
