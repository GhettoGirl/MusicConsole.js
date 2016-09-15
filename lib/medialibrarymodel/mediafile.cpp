#include "mediafile.hpp"
#include "tagreader.hpp"

#include <sys/stat.h>

MediaFile::MediaFile(const std::string &file)
{
    // check if regular file and readable by user
    struct stat sb;
    if (stat(file.c_str(), &sb) == 0 && S_ISREG(sb.st_mode) && sb.st_mode & S_IRUSR)
    {
        m_format = file.substr(file.find_last_of(".") + 1);
        (void) TagReader::read(*this);
    }
}

MediaFile::~MediaFile()
{
    m_loc.clear();
    m_format.clear();

    m_artist.clear();
    m_album.clear();
    m_title.clear();
    m_genre.clear();
}

void MediaFile::setArtist(const std::string &artist)
{
    m_artist = artist;
}

void MediaFile::setAlbum(const std::string &album)
{
    m_album = album;
}

void MediaFile::setTitle(const std::string &title)
{
    m_title = title;
}

void MediaFile::setGenre(const std::string &genre)
{
    m_genre = genre;
}

const std::string &MediaFile::location() const
{
    return m_loc;
}

const std::string &MediaFile::format() const
{
    return m_format;
}

const MediaFile::Type &MediaFile::type() const
{
    return m_type;
}

bool MediaFile::hasTags() const
{
    return !(m_artist.empty()
          && m_album.empty()
          && m_title.empty());
    // ignore genre as it isn't important
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

const std::string &MediaFile::genre() const
{
    return m_genre;
}

using namespace v8;

Persistent<v8::Function> MediaObject::constructor;

MediaObject::MediaObject()
{
}

MediaObject::~MediaObject()
{
}

void MediaObject::Init(Local<Object> exports)
{
    Isolate *isolate = exports->GetIsolate();

    // Prepare constructor template
    Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
    tpl->SetClassName(String::NewFromUtf8(isolate, "MediaObject"));
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    NODE_SET_PROTOTYPE_METHOD(tpl, "location",       Location);

    constructor.Reset(isolate, tpl->GetFunction());
    exports->Set(String::NewFromUtf8(isolate, "MediaObject"), tpl->GetFunction());
}

void MediaObject::New(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

    if (args.IsConstructCall())
    {
        // Invoked as constructor: `new MediaObject(...)`
        MediaObject *obj = new MediaObject();
        obj->Wrap(args.This());
        args.GetReturnValue().Set(args.This());
    }

    else
    {
        // Invoked as plain function `MediaObject(...)`, turn into construct call.
        const int argc = 1;
        Local<Value> argv[argc] = { args[0] };
        Local<Context> context = isolate->GetCurrentContext();
        Local<v8::Function> cons = Local<v8::Function>::New(isolate, constructor);
        Local<Object> result = cons->NewInstance(context, argc, argv).ToLocalChecked();
        args.GetReturnValue().Set(result);
    }

    MediaObject *obj = ObjectWrap::Unwrap<MediaObject>(args.Holder());
    String::Utf8Value param(args[0]->ToString());
    obj->m_file = new MediaFile(std::string(*param));
}

void MediaObject::Location(const v8::FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    MediaObject *obj = ObjectWrap::Unwrap<MediaObject>(args.Holder());
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, obj->m_file->location().c_str()));
}
