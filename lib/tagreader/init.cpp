#include <node.h>
#include "tagreader.hpp"

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports)
{
    TagReader::Init(exports);
}

NODE_MODULE(TagReader, InitAll)
