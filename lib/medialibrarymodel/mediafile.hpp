#ifndef MEDIAFILE_HPP
#define MEDIAFILE_HPP

#include <node.h>
#include <node_object_wrap.h>

#include <string>

class MediaFile
{
public:
    MediaFile(const std::string &file);
    ~MediaFile();

    enum Type {
        None = 0,
        Audio,
        Video,
        ModuleTracker
    };

    void setArtist(const std::string &artist);
    void setAlbum(const std::string &album);
    void setTitle(const std::string &title);
    void setGenre(const std::string &genre);

    const std::string &location() const;
    const std::string &format() const;
    const Type &type() const;

    bool hasTags() const;
    const std::string &artist() const;
    const std::string &album() const;
    const std::string &title() const;
    const std::string &genre() const;

private:
    std::string m_loc;
    std::string m_format;
    Type m_type = None;

    std::string m_artist;
    std::string m_album;
    std::string m_title;
    std::string m_genre;
};

class MediaObject : public node::ObjectWrap
{
public:
    static void Init(v8::Local<v8::Object> exports);

private:
    explicit MediaObject();
    ~MediaObject();

    static void New(const v8::FunctionCallbackInfo<v8::Value> &args);
    static v8::Persistent<v8::Function> constructor;

    static void Location(const v8::FunctionCallbackInfo<v8::Value> &args);

private:
    MediaFile *m_file = nullptr;
};

#endif // MEDIAFILE_HPP
