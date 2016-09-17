#include <node.h>
#include "binary-serialize.hpp"

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports)
{
    BinarySerialize::Init(exports);
}

NODE_MODULE(BinarySerialize, InitAll)
