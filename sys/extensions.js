/* Music Console
 * @extensions.js
 *
 * Extend global objects
 *
 */


// get key by value in objects
// alternative to std::map in C++11
// use this only for objects with unique values
Object.prototype.getKeyByValue = function(value)
{
    for (var prop in this)
    {
        if (this.hasOwnProperty(prop))
        {
            if (this[prop] == value)
            {
                return prop;
            }
        }
    }
}

// replace character in string at the given index and return it
String.prototype.replaceAt = function(index, character)
{
    return this.substr(0, index) + character + this.substr(index + character.length);
}

// changes the content of a string by removing a range of
// characters and/or adding new characters
String.prototype.splice = function(start, delCount, newSubStr)
{
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};