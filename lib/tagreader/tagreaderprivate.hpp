#ifndef TAGREADERPRIVATE_HPP
#define TAGREADERPRIVATE_HPP

#include <string>

struct Tags
{
    Tags() {}
    ~Tags()
    {
        this->clear();
    }

    void clear()
    {
        artist.clear();
        album.clear();
        title.clear();
        genre.clear();
    }

    bool isEmpty() const
    {
        return artist.empty()
              && album.empty()
              && title.empty()
              && genre.empty();
    }

    std::string artist;
    std::string album;
    std::string title;
    std::string genre;
};

namespace TagReaderPrivate
{

bool read(const std::string &file, Tags &tags);

} // namespace TagReaderPrivate

#endif // TAGREADERPRIVATE_HPP
