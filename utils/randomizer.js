/* Utils
 * @randomizer.js
 *
 * Returns a random number within the given range
 * Remembers the last n numbers, which will never be returned
 *
 */

// mt19937 random device
// gives better results than _any_ JavaScript/Node randomizer in my opinion
// C++11 chrono FTW! :)
// see lib/random_mt19937 for the implementation
const random_mt19937 = require('lib/random_mt19937').random_mt19937;

const method = Randomizer.prototype;

function Randomizer(history_size)
{
    this.setHistorySize(history_size);
    this.m_now = 0;

    // prevent infinite loop, can be caused when the history is larger then
    // the range between min and max
    this.m_maxattempts = this.m_history.length + 1;
}

method.setHistorySize = function(num)
{
    this.m_history = [];

    var size = num || 2; // default is 2
    for (let i = 0; i < size; i++)
    {
        this.m_history.push(0);
    }
}

method.random = function(min, max)
{
    if (min == 0 && max == 0)
    {
        return 0;
    }

    if (min > max)
    {
        return 0;
    }

    this.m_maxattempts = this.m_history.length + 1;
    while (this.m_history.includes(this.m_now))
    {
        if (this.m_maxattempts == 0)
        {
            break;
        }

        this.m_now = random_mt19937(min, max);
        this.m_maxattempts--;
    }

    this.m_history.push(this.m_now);
    this.m_history.shift();

    return this.m_now;
}

module.exports = Randomizer;
