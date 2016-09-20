#include <node.h>
#include "readline.hpp"

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports)
{
    GnuReadline::Init(exports);
}

NODE_MODULE(GnuReadline, InitAll)
