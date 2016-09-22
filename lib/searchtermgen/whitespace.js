/* SearchTermGen
 * @whitespace.js
 *
 * Converts any kind of whitespace into a 0x20 whitespace
 *
 */

const SearchTermGen = require('./searchtermgen.js');

function WhitespaceGen()
{
    SearchTermGen.call(this);

    this.m_whitespacemap = [
        // Whitespaces (Unicode character property "whitespace")
        '\u0009', // character tabulation
        '\u000A', // line feed
        '\u000B', // line tabulation
        '\u000C', // device control two
        '\u000D', // device control three
        '\u0020', // space
        '\u0080', // next line
        '\u00A0', // no-break space
        '\u1680', // ogham space mark
        '\u2000', // en quad
        '\u2001', // em quad
        '\u2002', // en space
        '\u2003', // em space
        '\u2004', // three-per-em space
        '\u2005', // four-per-em space
        '\u2006', // six-per-em space
        '\u2007', // figure space
        '\u2008', // punctuation space
        '\u2009', // thin space
        '\u200A', // hair space
        '\u2028', // line separator
        '\u2029', // paragraph separator
        '\u202F', // narrow no-break space
        '\u205F', // medium mathematical space
        '\u3000', // ideographic space (mainly CKJ)

        // Related characters
        '\u180E', // mongolian vowel separator
        '\u200B', // zero width space
        '\u200C', // zero width non-joiner
        '\u200D', // zero width joiner
        '\u2060', // word joiner
        '\uFEFF'  // zero width non-breaking space
    ];
}

WhitespaceGen.prototype = Object.create(SearchTermGen.prototype);
WhitespaceGen.prototype = {

generate: function(input)
{
    var strings = [];

    var whitespace = this.toRegularSpace(input);

    whitespace != input ? strings.push(whitespace) : false;

    return strings;
},

isWhitespace: function(c)
{
    for (const i of this.m_whitespacemap)
    {
        if (c == i)
        {
            return true;
        }
    }

    return false;
},

toRegularSpace: function(string)
{
    var buf = string;

    for (let i = 0; i < buf.length; i++)
    {
        if (this.isWhitespace(buf[i]))
        {
            buf = global.jsext.String.replaceAt(buf, i, ' ');
        }
    }

    return buf;
}

} // prototype

module.exports = WhitespaceGen;
