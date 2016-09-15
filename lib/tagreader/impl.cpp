#include "impl.hpp"

#include <taglib/taglib.h>
#include <taglib/fileref.h>
#include <taglib/rifffile.h>
#include <taglib/wavfile.h>

namespace TagReaderPrivate
{

/*bool read_using_taglib(MediaFile &file)
{
    TagLib::FileRef fileref(file.location().c_str(), false);

    if (!fileref.isNull())
    {
        if (!fileref.tag()->isEmpty())
        {
            file.setArtist(fileref.tag()->artist().toCString(true));
            file.setAlbum(fileref.tag()->album().toCString(true));
            file.setTitle(fileref.tag()->title().toCString(true));
            file.setGenre(fileref.tag()->genre().toCString(true));
        }
    }

    return file.hasTags();
}

bool read_riff_info_tags(MediaFile &file)
{
    TagLib::RIFF::WAV::File wav_file(file.location().c_str(), false);

    if (!wav_file.InfoTag()->isEmpty())
    {
        file.setArtist(wav_file.InfoTag()->artist().toCString(true));
        file.setAlbum(wav_file.InfoTag()->album().toCString(true));
        file.setTitle(wav_file.InfoTag()->title().toCString(true));
        file.setGenre(wav_file.InfoTag()->genre().toCString(true));
    }

    else if (!wav_file.ID3v2Tag()->isEmpty())
    {
        file.setArtist(wav_file.ID3v2Tag()->artist().toCString(true));
        file.setAlbum(wav_file.ID3v2Tag()->album().toCString(true));
        file.setTitle(wav_file.ID3v2Tag()->title().toCString(true));
        file.setGenre(wav_file.ID3v2Tag()->genre().toCString(true));
    }

    return file.hasTags();
}

bool read_matroska_metadata(MediaFile &file)
{
    // todo: implement matroska metadata reader
    (void) file;
    return false;
}

bool read(MediaFile &file)
{
    bool result = false;

    // RIFF INFO Tags
    if (file.format() == "wav")
    {
        if (!read_riff_info_tags(file))
        {
            result = read_using_taglib(file);
        }
    }

    // Matroska metadata
    else if (file.format() == "mkv" || file.format() == "mka")
    {
        if (!read_matroska_metadata(file))
        {
            result = read_using_taglib(file);
        }
    }

    // Other Tag Formats
    else
    {
        result = read_using_taglib(file);
    }

    return result;
}*/

} // namespace TagReaderPrivate
