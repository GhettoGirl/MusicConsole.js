/* js-extensions
 * @Object.js
 *
 * Extensions for Objects
 *
 */

module.exports = {

// Get key by value in objects.
// This is only good for objects with unique values.
getKeyByValue: function(obj, value)
{
    for (const prop in obj)
    {
        if (obj.hasOwnProperty(prop))
        {
            if (obj[prop] == value)
            {
                return prop;
            }
        }
    }
}

};
