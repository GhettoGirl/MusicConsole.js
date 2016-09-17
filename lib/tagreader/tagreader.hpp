#ifndef TAGLIB_HPP
#define TAGLIB_HPP

#include <node.h>
#include <node_object_wrap.h>

#include "tagreaderprivate.hpp"

class TagReader : public node::ObjectWrap
{
public:
    static void Init(v8::Local<v8::Object> exports);

private:
    explicit TagReader();
    ~TagReader();

    static void New(const v8::FunctionCallbackInfo<v8::Value> &args);
    static v8::Persistent<v8::Function> constructor;

    // js: (string: file)
    // return: (bool, whenever tags could be read from the file or not)
    static void LoadFile(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: [none]
    static void Clear(const v8::FunctionCallbackInfo<v8::Value> &args);

    // return: (string, tag field)
    static void Artist(const v8::FunctionCallbackInfo<v8::Value> &args);
    static void Album(const v8::FunctionCallbackInfo<v8::Value> &args);
    static void Title(const v8::FunctionCallbackInfo<v8::Value> &args);
    static void Genre(const v8::FunctionCallbackInfo<v8::Value> &args);

private:
    Tags m_tags;
};

#endif // TAGLIB_HPP