#include "tagreaderprivate.hpp"

#include <taglib/taglib.h>
#include <taglib/fileref.h>
#include <taglib/rifffile.h>
#include <taglib/wavfile.h>

bool str_ends_with(const std::string &str, const std::string &ending)
{
    if (str.length() >= ending.length())
    {
        return str.compare(str.length() - ending.length(), ending.length(), ending) == 0;
    }

    return false;
}

namespace TagReaderPrivate
{

bool read_generic(const std::string &file, Tags &tags)
{
    TagLib::FileRef fileref(file.c_str(), false);

    if (!fileref.isNull())
    {
        if (!fileref.tag()->isEmpty())
        {
            tags.artist = fileref.tag()->artist().toCString(true);
            tags.album  = fileref.tag()->album().toCString(true);
            tags.title  = fileref.tag()->title().toCString(true);
            tags.genre  = fileref.tag()->genre().toCString(true);
        }
    }

    return !tags.isEmpty();
}

// fixme: taglib fails for hacked-in unicode characters in info chunks
//        and returns an empty string
bool read_riff_info_tags(const std::string &file, Tags &tags)
{
    TagLib::RIFF::WAV::File wav_file(file.c_str(), false);

    if (!wav_file.InfoTag()->isEmpty())
    {
        tags.artist = wav_file.InfoTag()->artist().toCString(true);
        tags.album  = wav_file.InfoTag()->album().toCString(true);
        tags.title  = wav_file.InfoTag()->title().toCString(true);
        tags.genre  = wav_file.InfoTag()->genre().toCString(true);
    }

    else if (!wav_file.ID3v2Tag()->isEmpty())
    {
        tags.artist = wav_file.ID3v2Tag()->artist().toCString(true);
        tags.album  = wav_file.ID3v2Tag()->album().toCString(true);
        tags.title  = wav_file.ID3v2Tag()->title().toCString(true);
        tags.genre  = wav_file.ID3v2Tag()->genre().toCString(true);
    }

    return !tags.isEmpty();
}

bool read_matroska_metadata(const std::string &file, Tags &tags)
{
    // todo: implement matroska metadata reader
    (void) file;
    (void) tags;
    return false;
}

bool read(const std::string &file, Tags &tags)
{
    // RIFF INFO Tags
    if (str_ends_with(file, "wav"))
    {
        if (!read_riff_info_tags(file, tags))
        {
            (void) read_generic(file, tags);
        }
    }

    // Matroska metadata
    else if (str_ends_with(file, "mkv") || str_ends_with(file, "mka"))
    {
        if (!read_matroska_metadata(file, tags))
        {
            (void) read_generic(file, tags);
        }
    }

    // Other Tag Formats
    else
    {
        (void) read_generic(file, tags);
    }

    return !tags.isEmpty();
}

} // namespace TagReaderPrivate
