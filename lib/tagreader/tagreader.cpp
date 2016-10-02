#include "tagreader.hpp"

#ifndef _WIN32
#include <sys/stat.h>
#include <unistd.h>
#include <limits.h>

std::string do_readlink(const std::string &path)
{
    char buf[PATH_MAX];
    int len = ::readlink(path.c_str(), buf, sizeof(buf) - 1);

    if (len != -1)
    {
        buf[len] = '\0';
        return std::string(buf);
    }

    return std::string();
}
#endif

using namespace v8;

Persistent<v8::Function> TagReader::constructor;

TagReader::TagReader()
{
}

TagReader::~TagReader()
{
}

void TagReader::Init(Local<Object> exports)
{
    Isolate *isolate = exports->GetIsolate();

    // Prepare constructor template
    Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
    tpl->SetClassName(String::NewFromUtf8(isolate, "TagReader"));
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    NODE_SET_PROTOTYPE_METHOD(tpl, "loadFile",       LoadFile);
    NODE_SET_PROTOTYPE_METHOD(tpl, "clear",          Clear);
    NODE_SET_PROTOTYPE_METHOD(tpl, "artist",         Artist);
    NODE_SET_PROTOTYPE_METHOD(tpl, "album",          Album);
    NODE_SET_PROTOTYPE_METHOD(tpl, "title",          Title);
    NODE_SET_PROTOTYPE_METHOD(tpl, "genre",          Genre);

    constructor.Reset(isolate, tpl->GetFunction());
    exports->Set(String::NewFromUtf8(isolate, "TagReader"), tpl->GetFunction());
}

void TagReader::New(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

    if (args.IsConstructCall())
    {
        // Invoked as constructor: `new TagReader(...)`
        TagReader *obj = new TagReader();
        obj->Wrap(args.This());
        args.GetReturnValue().Set(args.This());
    }

    else
    {
        // Invoked as plain function `TagReader(...)`, turn into construct call.
        const int argc = 1;
        Local<Value> argv[argc] = { args[0] };
        Local<Context> context = isolate->GetCurrentContext();
        Local<v8::Function> cons = Local<v8::Function>::New(isolate, constructor);
        Local<Object> result = cons->NewInstance(context, argc, argv).ToLocalChecked();
        args.GetReturnValue().Set(result);
    }
}

void TagReader::LoadFile(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    TagReader *obj = ObjectWrap::Unwrap<TagReader>(args.Holder());

    String::Utf8Value param(args[0]->ToString());
    std::string file(*param);

    obj->m_tags.clear();
    bool result = false;

#ifndef _WIN32
    // check if regular file and readable by user, taglib crashes otherwise
    struct stat sb;
    if (stat(file.c_str(), &sb) == 0 && S_ISREG(sb.st_mode) && sb.st_mode & S_IRUSR)
    {
        result = TagReaderPrivate::read(file, obj->m_tags);
    }
#else
    result = TagReaderPrivate::read(file, obj->m_tags);
#endif

    args.GetReturnValue().Set(BooleanObject::New(isolate, result));
}

void TagReader::Clear(const FunctionCallbackInfo<Value> &args)
{
    TagReader *obj = ObjectWrap::Unwrap<TagReader>(args.Holder());
    obj->m_tags.clear();
}

void TagReader::Artist(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    TagReader *obj = ObjectWrap::Unwrap<TagReader>(args.Holder());

    args.GetReturnValue().Set(String::NewFromUtf8(isolate,
        obj->m_tags.artist.c_str()
    ));
}

void TagReader::Album(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    TagReader *obj = ObjectWrap::Unwrap<TagReader>(args.Holder());

    args.GetReturnValue().Set(String::NewFromUtf8(isolate,
        obj->m_tags.album.c_str()
    ));
}

void TagReader::Title(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    TagReader *obj = ObjectWrap::Unwrap<TagReader>(args.Holder());

    args.GetReturnValue().Set(String::NewFromUtf8(isolate,
        obj->m_tags.title.c_str()
    ));
}

void TagReader::Genre(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    TagReader *obj = ObjectWrap::Unwrap<TagReader>(args.Holder());

    args.GetReturnValue().Set(String::NewFromUtf8(isolate,
        obj->m_tags.genre.c_str()
    ));
}
