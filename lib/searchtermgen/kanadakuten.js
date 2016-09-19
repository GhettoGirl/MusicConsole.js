/* SearchTermGen
 * @kanadakuten.js
 *
 * This generator provides a way to produce kana characters which already
 * includes the DAKUTEN(濁点) and a kana with separate dakuten attached.
 * The dakuten characters are available as standalone chars which act as
 * combining characters.
 *
 * There are IMEs which use separate dakuten, which may skip actual
 * results on a search.
 *
 */

const SearchTermGen = require('./searchtermgen.js');

function KanaDakutenGen()
{
    SearchTermGen.call(this);

    this.m_kanamap = [
        '\u304B', '\u30AB', // か, カ
        '\u304D', '\u30AD', // き, キ
        '\u304F', '\u30AF', // く, ク
        '\u3051', '\u30B1', // け, ヶ
        '\u3053', '\u30B3', // こ, コ

        '\u3055', '\u30B5', // さ, サ
        '\u3057', '\u30B7', // し, シ
        '\u3059', '\u30B9', // す, ス
        '\u305B', '\u30BB', // せ, セ
        '\u305D', '\u30BD', // そ, ソ

        '\u305F', '\u30BF', // た, タ
        '\u3061', '\u30C1', // ち, チ
        '\u3064', '\u30C4', // つ, ツ
        '\u3066', '\u30C6', // て, テ
        '\u3068', '\u30C8', // と, ト

        '\u306F', '\u30CF', // は, ハ
        '\u3072', '\u30D2', // ひ, ヒ
        '\u3075', '\u30D5', // ふ, フ
        '\u3078', '\u30D8', // へ, ヘ
        '\u307B', '\u30DB'  // ほ, ホ
    ];

    this.m_kanadakutenmap = [
        '\u304C', '\u30AC', // が, ガ
        '\u304E', '\u30AE', // ぎ, ギ
        '\u3050', '\u30B0', // ぐ, グ
        '\u3052', '\u30B2', // げ, ゲ
        '\u3054', '\u30B4', // ご, ゴ

        '\u3056', '\u30B6', // ざ, ザ
        '\u3058', '\u30B8', // じ, ジ
        '\u305A', '\u30BA', // ず, ズ
        '\u305C', '\u30BC', // ぜ, ゼ
        '\u305E', '\u30BE', // ぞ, ゾ

        '\u3060', '\u30C0', // だ, ダ
        '\u3062', '\u30C2', // ぢ, ヂ
        '\u3065', '\u30C5', // づ, ヅ
        '\u3067', '\u30C7', // で, デ
        '\u3069', '\u30C9', // ど, ド

        '\u3070', '\u30D0', // ば, バ
        '\u3073', '\u30D3', // び, ビ
        '\u3076', '\u30D6', // ぶ, ブ
        '\u3079', '\u30D9', // べ, ベ
        '\u307C', '\u30DC', // ぼ, ボ

        '\u3071', '\u30D1', // ぱ, パ
        '\u3074', '\u30D4', // ぴ, ピ
        '\u3077', '\u30D7', // ぷ, プ
        '\u307A', '\u30DA', // ぺ, ペ
        '\u307D', '\u30DD'  // ぽ, ポ
    ];

    this.m_dakuten = {
        COMBINING_SEMI_VOICED_SOUND_MARK: '\u309A', // semi-voiced sound mark, used [part of gen]
        VOICED_SOUND_MARK:                '\u309B', // standalone sound mark, unused
        COMBINING_VOICED_SOUND_MARK:      '\u3099', // combining sound mark, used [part of gen]
        HALFWIDTH_VOICED_SOUND_MARK:      '\uFF9E'  // sound mark for halfwidth katakana, not part of char itself
    };
}

KanaDakutenGen.prototype = Object.create(SearchTermGen.prototype);
KanaDakutenGen.prototype = {

generate: function(input)
{
    var strings = [];

    var dakuten_inc = this.toKanaWithDakutenIncluded(input);
    var dakuten_sep = this.toKanaWithSeparateDakuten(input);

    dakuten_inc != input ? strings.push(dakuten_inc) : false;
    dakuten_sep != input ? strings.push(dakuten_sep) : false;

    return strings;
},

toKanaWithDakutenIncluded: function(string)
{
    var buf = string;

    for (var i = 0; i < buf.length; i++)
    {
        // ``
        if (buf[i] == this.m_dakuten.COMBINING_VOICED_SOUND_MARK)
        {
            if (typeof this.m_kanadakutenmap[this.m_kanamap.indexOf(buf[i - 1])] != "undefined")
            {
                buf = buf.splice(i - 1, 2, this.m_kanadakutenmap[this.m_kanamap.indexOf(buf[i - 1])]);
                i--;
            }
        }

        // °
        if (buf[i] == this.m_dakuten.COMBINING_SEMI_VOICED_SOUND_MARK)
        {
            if (typeof this.m_kanadakutenmap[this.m_kanamap.indexOf(buf[i - 1]) + 10] != "undefined")
            {
                buf = buf.splice(i - 1, 2, this.m_kanadakutenmap[this.m_kanamap.indexOf(buf[i - 1]) + 10]);
                i--;
            }
        }
    }

    return buf;
},

toKanaWithSeparateDakuten: function(string)
{
    var buf = string;

    for (var i = 0; i < buf.length; i++)
    {
        var index = this.m_kanadakutenmap.indexOf(buf[i]);
        if (index != -1)
        {
            // ``
            if (index <= 40)
            {
                buf = buf.splice(i, 1, this.m_kanamap[index] + this.m_dakuten.COMBINING_VOICED_SOUND_MARK);
                i++;
            }

            // °
            else
            {
                buf = buf.splice(i, 1, this.m_kanamap[index - 10] + this.m_dakuten.COMBINING_SEMI_VOICED_SOUND_MARK);
                i++;
            }
        }
    }

    return buf;
}

} // prototype

module.exports = KanaDakutenGen;
