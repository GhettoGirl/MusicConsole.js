/* SearchTermGen
 * @index.js
 *
 * Exports a instance of every generator within a namespace
 * Provides an array [ALL] which contains the instance of
 * all generators for instant and easy iteration.
 *
 */

const LatinGen = new (require('./latin.js'));
const KanaGen = new (require('./kana.js'));
const KanaDakutenGen = new (require('./kanadakuten.js'));
const WhitespaceGen = new (require('./whitespace.js'));

module.exports = {
    LatinGen,
    KanaGen,
    KanaDakutenGen,
    WhitespaceGen,

    ALL: [LatinGen, KanaGen, KanaDakutenGen, WhitespaceGen]
};
