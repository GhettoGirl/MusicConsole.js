#include "medialibrarymodel.hpp"

#include <iostream>

using namespace v8;

// note: 'Function' conflicts with something else somewhere
//       use 'v8::Function' explicitly

Persistent<v8::Function> MediaLibraryModel::constructor;

MediaLibraryModel::MediaLibraryModel()
{
}

MediaLibraryModel::~MediaLibraryModel()
{
}

void MediaLibraryModel::Init(Local<Object> exports)
{
    Isolate *isolate = exports->GetIsolate();

    // Prepare constructor template
    Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
    tpl->SetClassName(String::NewFromUtf8(isolate, "MediaLibraryModel"));
    tpl->InstanceTemplate()->SetInternalFieldCount(6);

    // Prototype
    NODE_SET_PROTOTYPE_METHOD(tpl, "init",           Init);
    NODE_SET_PROTOTYPE_METHOD(tpl, "clear",          Clear);

    NODE_SET_PROTOTYPE_METHOD(tpl, "setRootPath",    SetRootPath);
    NODE_SET_PROTOTYPE_METHOD(tpl, "rootPath",       RootPath);

    NODE_SET_PROTOTYPE_METHOD(tpl, "scan",           Scan);

    // Just for quick unit testing
    NODE_SET_PROTOTYPE_METHOD(tpl, "testme",         TestMe);

    constructor.Reset(isolate, tpl->GetFunction());
    exports->Set(String::NewFromUtf8(isolate, "MediaLibraryModel"), tpl->GetFunction());
}

void MediaLibraryModel::New(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

    if (args.IsConstructCall())
    {
        // Invoked as constructor: `new MediaLibraryModel(...)`
        MediaLibraryModel *obj = new MediaLibraryModel();
        obj->Wrap(args.This());
        args.GetReturnValue().Set(args.This());
    }

    else
    {
        // Invoked as plain function `MediaLibraryModel(...)`, turn into construct call.
        const int argc = 1;
        Local<Value> argv[argc] = { args[0] };
        Local<Context> context = isolate->GetCurrentContext();
        Local<v8::Function> cons = Local<v8::Function>::New(isolate, constructor);
        Local<Object> result = cons->NewInstance(context, argc, argv).ToLocalChecked();
        args.GetReturnValue().Set(result);
    }
}

void MediaLibraryModel::Init(const FunctionCallbackInfo<Value> &args)
{
    //Isolate *isolate = args.GetIsolate();
    MediaLibraryModel *obj = ObjectWrap::Unwrap<MediaLibraryModel>(args.Holder());

    obj->m_fsm = new FileSystemModel();
}

void MediaLibraryModel::Clear(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    //Isolate *isolate = args.GetIsolate();
    MediaLibraryModel *obj = ObjectWrap::Unwrap<MediaLibraryModel>(args.Holder());

    obj->m_fsm->clear();
    obj->m_files.clear();
}

void MediaLibraryModel::SetRootPath(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    MediaLibraryModel *obj = ObjectWrap::Unwrap<MediaLibraryModel>(args.Holder());

    String::Utf8Value param(args[0]->ToString());
    std::string path = std::string(*param);

    bool success = obj->m_fsm->setPath(path);

    args.GetReturnValue().Set(BooleanObject::New(isolate, success));
}

void MediaLibraryModel::RootPath(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    MediaLibraryModel *obj = ObjectWrap::Unwrap<MediaLibraryModel>(args.Holder());

    args.GetReturnValue().Set(String::NewFromUtf8(isolate,
        obj->m_fsm->path().c_str()
    ));
}

void MediaLibraryModel::Scan(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    //Isolate *isolate = args.GetIsolate();
    MediaLibraryModel *obj = ObjectWrap::Unwrap<MediaLibraryModel>(args.Holder());

    obj->m_fsm->scan();
    for (auto&& file : obj->m_fsm->files())
    {
        // this is were we need the 'MediaFile' class to be implemented first :^)
    }
}

void MediaLibraryModel::TestMe(const FunctionCallbackInfo<Value> &args)
{
    //Isolate *isolate = args.GetIsolate();
    MediaLibraryModel *obj = ObjectWrap::Unwrap<MediaLibraryModel>(args.Holder());

    String::Utf8Value param(args[0]->ToString());
    std::string path = std::string(*param);

    std::cout << "Path = '" << path << '\'' << std::endl;

    if (obj->m_fsm->setPath(path))
    {
        obj->m_fsm->scan();
        for (auto&& file : obj->m_fsm->files())
        {
            std::cout << file << std::endl;
        }
    }

    else
    {
        std::cout << "given path does not exists or not readable" << std::endl;
    }
}
