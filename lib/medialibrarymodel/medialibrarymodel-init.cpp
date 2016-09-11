#include <node.h>
#include "medialibrarymodel.hpp"

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports)
{
    MediaLibraryModel::Init(exports);
}

NODE_MODULE(MediaLibraryModel, InitAll)
