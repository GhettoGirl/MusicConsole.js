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

    this.m_kanamap = {
        hiragana: [ 'あ', 'い', 'う', 'え', 'お',
                    'か', 'き', 'く', 'け', 'こ',
                    'さ', 'し', 'す', 'せ', 'そ',
                    'た', 'ち', 'つ', 'て', 'と',
                    'な', 'に', 'ぬ', 'ね', 'の',
                    'は', 'ひ', 'ふ', 'へ', 'ほ',
                    'ま', 'み', 'む', 'め', 'も',
                    'や', /*　*/'ゆ', /*　*/'よ',
                    'ら', 'り', 'る', 'れ', 'ろ',
                    'わ', 'ゐ', /*　*/'ゑ', 'を',

                    'が', 'ぎ', 'ぐ', 'げ', 'ご',
                    'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
                    'だ', 'ぢ', 'づ', 'で', 'ど',
                    'ば', 'び', 'ぶ', 'べ', 'ぼ',
                    'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',

                    'っ', 'ん',
                    'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ',
                    'ゃ', /*　*/'ゅ', /*　*/'ょ',

                    'ー'
        ],

        katakana: [ 'ア', 'イ', 'ウ', 'エ', 'オ',
                    'カ', 'キ', 'ク', 'ケ', 'コ',
                    'サ', 'シ', 'ス', 'セ', 'ソ',
                    'タ', 'チ', 'ツ', 'テ', 'ト',
                    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
                    'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
                    'マ', 'ミ', 'ム', 'メ', 'モ',
                    'ヤ', /*　*/'ユ', /*　*/'ヨ',
                    'ラ', 'リ', 'ル', 'レ', 'ロ',
                    'ワ', 'ヰ', /*　*/'ヱ', 'ヲ',

                    'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
                    'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
                    'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
                    'バ', 'ビ', 'ブ', 'ベ', 'ボ',
                    'パ', 'ピ', 'プ', 'ペ', 'ポ',

                    'ッ', 'ン',
                    'ァ', 'ィ', 'ゥ', 'ェ', 'ォ',
                    'ャ', /*　*/'ュ', /*　*/'ョ',

                    'ｰ'
        ],

        // [44] and [45] is undefined, because there is no ヰ and ヱ in halfwidth katakana
        halfwidth: [ 'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ',
                     'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ',
                     'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ',
                     'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ',
                     'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ',
                     'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ',
                     'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ',
                     'ﾔ',      'ﾕ',      'ﾖ',
                     'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ',
                     'ﾜ', undefined, undefined, 'ｦ',

                     'ｶﾞ', 'ｷﾞ', 'ｸﾞ', 'ｹﾞ', 'ｺﾞ',
                     'ｻﾞ', 'ｼﾞ', 'ｽﾞ', 'ｾﾞ', 'ｿﾞ',
                     'ﾀﾞ', 'ﾁﾞ', 'ﾂﾞ', 'ﾃﾞ', 'ﾄﾞ',
                     'ﾊﾞ', 'ﾋﾞ', 'ﾌﾞ', 'ﾍﾞ', 'ﾎﾞ',
                     'ﾊﾟ', 'ﾋﾟ', 'ﾌﾟ', 'ﾍﾟ', 'ﾎﾟ',

                     'ｯ', 'ﾝ',
                     'ｧ', 'ｨ', 'ｩ', 'ｪ', 'ｫ',
                     'ｬ',      'ｭ',      'ｮ',

                     'ｰ'
        ]
    };
}

KanaGen.prototype = Object.create(SearchTermGen.prototype);
KanaGen.prototype = {

generate: function(input)
{
    var strings = [];

    var hiragana = this.toHiragana(input);
    var katakana = this.toKatakana(input);
    var halfwidth = this.toHalfwidth(input);

    hiragana != input ? strings.push(hiragana) : false;
    katakana != input ? strings.push(katakana) : false;
    halfwidth != input ? strings.push(halfwidth) : false;

    return strings;
},

// checks if character is a kana
isKana: function(c)
{
    if (this.isHiragana(c) || this.isKatakana(c) || this.isHalfwidth(c))
    {
        return true;
    }

    return false;
},

// checks if character is a hiragana
isHiragana: function(c)
{
    for (var i of this.m_kanamap.hiragana)
    {
        if (c == i)
        {
            return true;
        }
    }

    return false;
},

// checks if character is a katakana
isKatakana: function(c)
{
    for (var i of this.m_kanamap.katakana)
    {
        if (c == i)
        {
            return true;
        }
    }

    return false;
},

// checks if character is a halfwidth-katakana
isHalfwidth: function(c)
{
    for (var i of this.m_kanamap.halfwidth)
    {
        if (c == i)
        {
            return true;
        }
    }

    return false;
},

// converts any kana in the string to hiragana
toHiragana: function(string)
{
    var buf = string;

    for (var i = 0; i < buf.length; i++)
    {
        if (this.isKatakana(buf[i]))
        {
            buf = buf.replaceAt(i, this.m_kanamap.hiragana[this.m_kanamap.katakana.indexOf(buf[i])]);
        }

        else if (this.isHalfwidth(buf[i]))
        {
            buf = buf.replaceAt(i, this.m_kanamap.hiragana[this.m_kanamap.halfwidth.indexOf(buf[i])]);
        }
    }

    return buf;
},

// converts any kana in the string to katakana
toKatakana: function(string)
{
    var buf = string;

    for (var i = 0; i < buf.length; i++)
    {
        if (this.isHiragana(buf[i]))
        {
            buf = buf.replaceAt(i, this.m_kanamap.katakana[this.m_kanamap.hiragana.indexOf(buf[i])]);
        }

        else if (this.isHalfwidth(buf[i]))
        {
            buf = buf.replaceAt(i, this.m_kanamap.katakana[this.m_kanamap.halfwidth.indexOf(buf[i])]);
        }
    }

    return buf;
},

// converts any kana in the string to halfwidth-katakana
// the 2 kana which doesn't exists in halfwidth will be converted into katakana
toHalfwidth: function(string)
{
    var buf = string;

    for (var i = 0; i < buf.length; i++)
    {
        if (this.isHiragana(buf[i]))
        {
            if (typeof this.m_kanamap.halfwidth[this.m_kanamap.hiragana.indexOf(buf[i])] == "undefined")
            {
                buf = buf.replaceAt(i, this.m_kanamap.katakana[this.m_kanamap.hiragana.indexOf(buf[i])]);
            }

            else
            {
                buf = buf.replaceAt(i, this.m_kanamap.halfwidth[this.m_kanamap.hiragana.indexOf(buf[i])]);
            }
        }

        else if (this.isKatakana(buf[i]))
        {
            if (typeof this.m_kanamap.halfwidth[this.m_kanamap.katakana.indexOf(buf[i])] == "undefined")
            {
                buf = buf.replaceAt(i, this.m_kanamap.katakana[this.m_kanamap.katakana.indexOf(buf[i])]);
            }

            else
            {
                buf = buf.replaceAt(i, this.m_kanamap.halfwidth[this.m_kanamap.katakana.indexOf(buf[i])]);
            }
        }
    }

    return buf;
}

} // prototype

module.exports = KanaGen;
