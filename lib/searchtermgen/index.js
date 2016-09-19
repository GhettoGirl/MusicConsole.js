/* SearchTermGen
 * @index.js
 *
 * Exports a instance of every generator within a namespace
 * Provides an array [ALL] which contains the instance of
 * all generators for instant and easy iteration.
 *
 */

const LatinGen_Class = require('./latin.js');
const KanaGen_Class = require('./kana.js');
const KanaDakutenGen_Class = require('./kanadakuten.js');

const LatinGen = new LatinGen_Class();
const KanaGen = new KanaGen_Class();
const KanaDakutenGen = new KanaDakutenGen_Class();

module.exports = {
    LatinGen,
    KanaGen,
    KanaDakutenGen,

    ALL: [LatinGen, KanaGen, KanaDakutenGen]
};
