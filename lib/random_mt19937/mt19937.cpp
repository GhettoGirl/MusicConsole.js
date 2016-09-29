#include <node.h>

#include <chrono>
#include <random>

using namespace v8;

void random_mt19937(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

    static std::random_device rd;
    static std::mt19937 mt(rd());
    std::uniform_int_distribution<int> dist(args[0]->ToInteger()->Value(),
                                            args[1]->ToInteger()->Value());

    args.GetReturnValue().Set(Integer::New(isolate, dist(mt)));
}

void Init(Local<Object> exports)
{
    NODE_SET_METHOD(exports, "random_mt19937", random_mt19937);
}

NODE_MODULE(random_mt19937, Init)
