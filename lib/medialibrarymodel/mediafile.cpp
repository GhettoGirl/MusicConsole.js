#include "mediafile.hpp"

#include "tagreader.hpp"

MediaFile::MediaFile(const std::string &file)
{
}

MediaFile::~MediaFile()
{
    m_loc.clear();

    m_artist.clear();
    m_album.clear();
    m_title.clear();
}

const std::string &MediaFile::location() const
{
    return m_loc;
}

const std::string &MediaFile::artist() const
{
    return m_artist;
}

const std::string &MediaFile::album() const
{
    return m_album;
}

const std::string &MediaFile::title() const
{
    return m_title;
}
