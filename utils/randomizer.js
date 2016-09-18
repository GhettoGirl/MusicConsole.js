/* Music Console
 * @randomizer.js
 *
 * Returns a random number within the given range
 *
 */

module.exports = function(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
};
