#ifndef MEDIALIBRARYMODEL_HPP
#define MEDIALIBRARYMODEL_HPP

#include <node.h>
#include <node_object_wrap.h>

class MediaLibraryModel : public node::ObjectWrap
{
public:
    static void Init(v8::Local<v8::Object> exports);

private:
    explicit MediaLibraryModel();
    ~MediaLibraryModel();

    static void New(const v8::FunctionCallbackInfo<v8::Value> &args);
    static v8::Persistent<v8::Function> constructor;

    // js: [none]
    static void Stub(const v8::FunctionCallbackInfo<v8::Value> &args);
};

#endif // MEDIALIBRARYMODEL_HPP
