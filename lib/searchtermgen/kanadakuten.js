/* SearchTermGen
 * @kanadakuten.js
 *
 * This generator provides a way to produce kana characters which already
 * includes the DAKUTEN(濁点) and a kana with separate dakuten attached.
 * The dakuten character is available as standalone char which acts as a
 * combining character. Actually there are 4 standalone dakuten chars.
 * More details can be found in the unicode specifications.
 *
 */

const SearchTermGen = require('./searchtermgen.js');

function KanaDakutenGen()
{
    SearchTermGen.call(this);
}

KanaDakutenGen.prototype = Object.create(SearchTermGen.prototype);
KanaDakutenGen.prototype = {

    generate: function(input)
    {
        return [];
    },

} // prototype

module.exports = KanaDakutenGen;
