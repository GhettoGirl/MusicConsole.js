#ifndef MEDIAFILE_HPP
#define MEDIAFILE_HPP

#include <string>

class MediaFile
{
public:
    MediaFile(const std::string &file);
    ~MediaFile();

    const std::string &location() const;

    const std::string &artist() const;
    const std::string &album() const;
    const std::string &title() const;

private:
    std::string m_loc;

    std::string m_artist;
    std::string m_album;
    std::string m_title;
};

#endif // MEDIAFILE_HPP
