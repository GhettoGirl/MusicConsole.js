#ifndef MEDIALIBRARYMODEL_HPP
#define MEDIALIBRARYMODEL_HPP

#include <node.h>
#include <node_object_wrap.h>

#include "filesystemmodel.hpp"

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
    static void Init(const v8::FunctionCallbackInfo<v8::Value> &args);

    // === for testing ===
    // js: (string: path)
    static void TestMe(const v8::FunctionCallbackInfo<v8::Value> &args);

private:
    FileSystemModel *m_fsm = nullptr;
};

#endif // MEDIALIBRARYMODEL_HPP
