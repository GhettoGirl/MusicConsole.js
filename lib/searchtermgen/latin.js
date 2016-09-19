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

    this.m_latinmap = {
        // upper-case
        "A":"Ａ",
        "B":"Ｂ",
        "C":"Ｃ",
        "D":"Ｄ",
        "E":"Ｅ",
        "F":"Ｆ",
        "G":"Ｇ",
        "H":"Ｈ",
        "I":"Ｉ",
        "J":"Ｊ",
        "K":"Ｋ",
        "L":"Ｌ",
        "M":"Ｍ",
        "N":"Ｎ",
        "O":"Ｏ",
        "P":"Ｐ",
        "Q":"Ｑ",
        "R":"Ｒ",
        "S":"Ｓ",
        "T":"Ｔ",
        "U":"Ｕ",
        "V":"Ｖ",
        "W":"Ｗ",
        "X":"Ｘ",
        "Y":"Ｙ",
        "Z":"Ｚ",

        // lower-case
        "a":"ａ",
        "b":"ｂ",
        "c":"ｃ",
        "d":"ｄ",
        "e":"ｅ",
        "f":"ｆ",
        "g":"ｇ",
        "h":"ｈ",
        "i":"ｉ",
        "j":"ｊ",
        "k":"ｋ",
        "l":"ｌ",
        "m":"ｍ",
        "n":"ｎ",
        "o":"ｏ",
        "p":"ｐ",
        "q":"ｑ",
        "r":"ｒ",
        "s":"ｓ",
        "t":"ｔ",
        "u":"ｕ",
        "v":"ｖ",
        "w":"ｗ",
        "x":"ｘ",
        "y":"ｙ",
        "z":"ｚ",

        // numbers
        "0":"０",
        "1":"１",
        "2":"２",
        "3":"３",
        "4":"４",
        "5":"５",
        "6":"６",
        "7":"７",
        "8":"８",
        "9":"９",

        // symbols
        "!":"！",
        "#":"＃",
        "$":"＄",
        "%":"％",
        ",":"、",
        "&":"＆",
        "(":"（",
        ")":"）",
        "*":"＄",
        "+":"＋",
        "-":"－",
        ".":"．",
        "/":"／",
        ":":"：",
        ";":"；",
        "<":"＜",
        ">":"＞",
        "=":"＝",
        "?":"？",
        "~":"～",
        "|":"｜",
        "{":"｛",
        "}":"｝",
        "[":"［",
        "]":"］",
        "@":"＠",
        "_":"＿",
        "^":"＾",
        "`":"｀",

        "\"":"”",
        "'":"’",
        "\\":"＼",

        // other
        "·":"・"
    };
}

LatinGen.prototype = Object.create(SearchTermGen.prototype);
LatinGen.prototype = {

generate: function(input)
{
    var strings = [];

    var latin1 = this.toLatin1(input);
    var widelatin = this.toWideLatin(input);

    latin1 != input ? strings.push(latin1) : false;
    widelatin != input ? strings.push(widelatin) : false;

    return strings;
},

// checks if character is a latin char
isLatinChar: function(c)
{
    if (this.isLatin1Char(c) || this.isWideLatinChar(c))
    {
        return true;
    }

    return false;
},

// checks is character is of type latin-1
isLatin1Char: function(c)
{
    for (var key in this.m_latinmap)
    {
        if (this.m_latinmap.hasOwnProperty(key))
        {
            if (c == key)
            {
                return true;
            }
        }
    }

    return false;
},

// checks if character is of type widelatin
isWideLatinChar: function(c)
{
    for (var key in this.m_latinmap)
    {
        if (this.m_latinmap.hasOwnProperty(key))
        {
            if (c == this.m_latinmap[key])
            {
                return true;
            }
        }
    }

    return false;
},

// converts any latin char in the string to latin-1
toLatin1: function(string)
{
    var buf = string;

    for (var i = 0; i < buf.length; i++)
    {
        if (this.isWideLatinChar(buf[i]))
        {
            buf = buf.replaceAt(i, this.m_latinmap.getKeyByValue(buf[i]));
        }
    }

    return buf;
},

// converts any latin char in the string to widelatin
toWideLatin: function(string)
{
    var buf = string;

    for (var i = 0; i < buf.length; i++)
    {
        if (this.isLatin1Char(buf[i]))
        {
            buf = buf.replaceAt(i, this.m_latinmap[buf[i]]);
        }
    }

    return buf;
}

} // prototype

module.exports = LatinGen;
