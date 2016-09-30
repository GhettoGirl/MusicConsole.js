/* SearchTermGen
 * @template.js
 *
 * [template, use this to create new SearchTermGens]
 *
 */

const SearchTermGen = require('./searchtermgen.js');

function TemplateGen()
{
    SearchTermGen.call(this);
}

TemplateGen.prototype = Object.create(SearchTermGen.prototype);
TemplateGen.prototype = {

generate: function(input)
{
    var strings = [];

    var example = this.toExample(input);

    example != input ? strings.push(example) : false;

    return strings;
},

} // prototype

module.exports = TemplateGen;
