#include "tagreader.hpp"

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
    //Isolate *isolate = args.GetIsolate();
    //TagReader *obj = ObjectWrap::Unwrap<TagReader>(args.Holder());
}
