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
    NODE_SET_PROTOTYPE_METHOD(tpl, "saveFile",       SaveFile);
    NODE_SET_PROTOTYPE_METHOD(tpl, "addData",        AddData);
    NODE_SET_PROTOTYPE_METHOD(tpl, "loadData",       LoadData);

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
    BinarySerialize *obj = ObjectWrap::Unwrap<BinarySerialize>(args.Holder());

    String::Utf8Value file(args[0]->ToString());
    obj->m_file = std::string(*file);
}

void BinarySerialize::SaveFile(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    BinarySerialize *obj = ObjectWrap::Unwrap<BinarySerialize>(args.Holder());

    std::ofstream os(obj->m_file.c_str(), std::ios::binary);
    cereal::BinaryOutputArchive archive(os);

    archive(cereal::make_nvp("_mC", obj->m_data));
    os.close();

    // todo: check if a file was created
    args.GetReturnValue().Set(BooleanObject::New(isolate, true));
}

void BinarySerialize::AddData(const FunctionCallbackInfo<Value> &args)
{
    BinarySerialize *obj = ObjectWrap::Unwrap<BinarySerialize>(args.Holder());

    obj->m_priv_data.clear();

    Local<Array> input = Local<Array>::Cast(args[0]);
    unsigned int size = input->Length();

    for (unsigned int i = 0; i < size; i++)
    {
        obj->m_priv_data.push_back(
            *(String::Utf8Value(input->Get(i)->ToString()))
        );
    }

    obj->m_data.setData(obj->m_priv_data);
}

void BinarySerialize::LoadData(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    BinarySerialize *obj = ObjectWrap::Unwrap<BinarySerialize>(args.Holder());

    std::ifstream is(obj->m_file.c_str(), std::ios::binary);
    cereal::BinaryInputArchive archive(is);

    obj->m_priv_data.clear();
    archive(obj->m_priv_data);

    Local<Array> data = Array::New(isolate, obj->m_priv_data.size());

    for (unsigned int i = 0; i < obj->m_priv_data.size(); i++)
    {
        data->Set(i, String::NewFromUtf8(isolate, obj->m_priv_data.at(i).c_str()));
    }

    args.GetReturnValue().Set(data);
}
