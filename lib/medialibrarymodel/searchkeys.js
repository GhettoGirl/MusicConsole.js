/* MediaLibraryModel
 * @searchkeys.js
 *
 * Advanced filter patterns
 * Ported from the C++ version of Music Console without changes
 * (except language specific ones ;p)
 *
 */

const simplifystring = require('utils/simplifystring.js');

const method = SearchKeys.prototype;

const SearchPatternType = {
    Default: 0,               // <main>
    IncludeIntoMainSearch: 1, // search for something |w also search for this
    WithoutAnyOfThis: 2,      // search term          |wo without this terms
    WithoutGenre: 3,          // search term          |wg genre <--- filter out tracks of a specific genre

    // internal, do not check against it, there is never a match
    // search term |a one |a two <--- extends to this 'search term one' and 'search term two'
    AppendToMainSearch: 4
};

function SearchKeys(search_term)
{
    // RegExp
    this.m_searchpattern;
    this.m_extended_searchpatterns = [];


    var buf = simplifystring(search_term);

    // extended search patterns
    if (buf.indexOf('|') != -1)
    {
        var tmp = buf.split('|').filter(function(value)
        {
            return (simplifystring(value) != '');
        });

        if (tmp.length != 0)
        {
            this.m_searchpattern = {
                pattern: this.createSearchPattern(tmp[0]),
                type: SearchPatternType.Default
            };
            tmp.shift();
        }

        for (const t of tmp)
        {

            /// |a term
            if (t.startsWith("a "))
            {
                var regex = jsext.RegExp.toStringRaw(this.m_searchpattern.pattern);
                regex = regex.substr(0, regex.length - 1);

                this.m_extended_searchpatterns.push({
                    pattern: this.createSearchPattern(regex + "$" + t.substr(2)),
                    type: SearchPatternType.AppendToMainSearch
                });
            }

            /// |w term
            else if (t.startsWith("w "))
            {
                this.m_extended_searchpatterns.push({
                    pattern: this.createSearchPattern(t.substr(2)),
                    type: SearchPatternType.IncludeIntoMainSearch
                });
            }

            /// |wo term
            else if (t.startsWith("wo "))
            {
                this.m_extended_searchpatterns.push({
                    pattern: this.createSearchPattern(t.substr(3)),
                    type: SearchPatternType.WithoutAnyOfThis
                });
            }

            /// |wg genre
            else if (t.startsWith("wg "))
            {
                this.m_extended_searchpatterns.push({
                    pattern: this.createSearchPattern(t.substr(3)),
                    type: SearchPatternType.WithoutGenre
                });
            }

            // ignore unknown pattern commands
        }

        tmp.length = 0;
    }

    // normal search keys
    else
    {
        this.m_searchpattern = {
            pattern: this.createSearchPattern(buf),
            type: SearchPatternType.Default
        }
    }

    // finalize

    var add_default = true;
    for (const p in this.m_extended_searchpatterns)
    {
        if (this.m_extended_searchpatterns[p].type == SearchPatternType.AppendToMainSearch)
        {
            this.m_extended_searchpatterns[p].type = SearchPatternType.Default;
            add_default = false;
        }
    }

    if (add_default)
    {
        this.m_extended_searchpatterns = [this.m_searchpattern].concat(this.m_extended_searchpatterns);
    }

    this.m_extended_searchpatterns = this.m_extended_searchpatterns.sort(function(p1, p2)
    {
        return (p1.type < p2.type);
    });
}

method.createSearchPattern = function(search_term)
{
    var search_keys = search_term;

    // Create basic search keys (*search*term*)
    search_keys = jsext.String.replaceAll(search_keys, ' ', '.*');
    search_keys = '.*' + search_keys + '.*';

    // Replace brackets, parentheses, slashes and other regex syntax characters
    // todo: doesn't cover all characters yet
    search_keys = search_keys.replace(RegExp("[\\[\\]\\(\\)\\\\\\/\\^\\$]", 'g'), '.*');

    // replace all instances of [*] with [.*]
    for (let i = 0; i < search_keys.length; i++)
    {
        if (search_keys[i] == '*' && search_keys[i - 1] != '.')
        {
            search_keys = jsext.String.splice(search_keys, i, 1, ".*");
            i++;
        }
    }

    // Clean up search keys (remove occurrent following wildcards) [ eg: '.*.*.*' becomes '.*' ]
    for (let i = 0; i < search_keys.length; i++)
    {
        if (search_keys[i] == '.' && search_keys[i + 1] == '*')
        {
            if (search_keys.length > i + 2)
            {
                if (search_keys[i + 2] == '.' && search_keys[i + 3] == '*')
                {
                    search_keys = jsext.String.splice(search_keys, i, 2, '');
                    i = 0;
                }
            }
        }
    }

    search_keys = "^" + search_keys + "$";

    return RegExp(search_keys, 'i');
}

// if a type is specified a filtered list will be returned
method.searchPatterns = function(type)
{
    if (typeof type == "undefined")
    {
        return this.m_extended_searchpatterns;
    }

    else
    {
        var patterns = [];

        for (const s of this.m_extended_searchpatterns)
        {
            if (s.type == type)
            {
                patterns.push(s);
            }
        }

        return patterns;
    }
}

// checks if the list contains elements of the given type
method.containsKey = function(type)
{
    for (const s of this.m_extended_searchpatterns)
    {
        if (s.type == type)
        {
            return true;
        }
    }

    return false;
}

// counts the number of elements of the given type
method.countKeys = function(type)
{
    var c = 0;

    for (var s of this.m_extended_searchpatterns)
    {
        if (s.type == type)
        {
            c++;
        }
    }

    return c;
}

// checks whenever the list is empty or not
method.isEmpty = function()
{
    var regex_rawstr = jsext.RegExp.toStringRaw(this.m_searchpattern.pattern);
    var str = jsext.String.replaceAll(regex_rawstr, '\\.\\*', '');
    return (str == '');
}

module.exports = {
    SearchKeys,
    SearchPatternType
};
