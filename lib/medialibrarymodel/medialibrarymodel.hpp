#ifndef MEDIALIBRARYMODEL_HPP
#define MEDIALIBRARYMODEL_HPP

#include <node.h>
#include <node_object_wrap.h>

#include <vector>

#include "filesystemmodel.hpp"
#include "mediafile.hpp"

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
    static void Clear(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: (string: path which should be scanned)
    // return: (bool, whenever the path was valid or not)
    static void SetRootPath(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: [none]
    // return: (string, root path)
    static void RootPath(const v8::FunctionCallbackInfo<v8::Value> &args);

    // builds the media library
    //  × scans the filesystem from the root path
    //  × reads the tags
    //  × caches the tags into a ??? (not sure at the moment)
    //
    // js: [none]
    static void Scan(const v8::FunctionCallbackInfo<v8::Value> &args);

    // === for testing ===
    // js: (string: path)
    static void TestMe(const v8::FunctionCallbackInfo<v8::Value> &args);

private:
    FileSystemModel *m_fsm = nullptr;

    std::vector<MediaFile> m_files;
};

#endif // MEDIALIBRARYMODEL_HPP
