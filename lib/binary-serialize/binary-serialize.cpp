#include "binary-serialize.hpp"

using namespace v8;

Persistent<v8::Function> BinarySerialize::constructor;

BinarySerialize::BinarySerialize()
{
}

BinarySerialize::~BinarySerialize()
{
}

void BinarySerialize::Init(Local<Object> exports)
{
    Isolate *isolate = exports->GetIsolate();

    // Prepare constructor template
    Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
    tpl->SetClassName(String::NewFromUtf8(isolate, "BinarySerialize"));
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    NODE_SET_PROTOTYPE_METHOD(tpl, "setFile",        SetFile);

    constructor.Reset(isolate, tpl->GetFunction());
    exports->Set(String::NewFromUtf8(isolate, "BinarySerialize"), tpl->GetFunction());
}

void BinarySerialize::New(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

    if (args.IsConstructCall())
    {
        // Invoked as constructor: `new BinarySerialize(...)`
        BinarySerialize *obj = new BinarySerialize();
        obj->Wrap(args.This());
        args.GetReturnValue().Set(args.This());
    }

    else
    {
        // Invoked as plain function `BinarySerialize(...)`, turn into construct call.
        const int argc = 1;
        Local<Value> argv[argc] = { args[0] };
        Local<Context> context = isolate->GetCurrentContext();
        Local<v8::Function> cons = Local<v8::Function>::New(isolate, constructor);
        Local<Object> result = cons->NewInstance(context, argc, argv).ToLocalChecked();
        args.GetReturnValue().Set(result);
    }
}

void BinarySerialize::SetFile(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    BinarySerialize *obj = ObjectWrap::Unwrap<BinarySerialize>(args.Holder());
    
    String::Utf8Value file(args[0]->ToString());
    obj->m_file = std::string(*file);
}
