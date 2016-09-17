#ifndef BINARYSERIALIZE_HPP
#define BINARYSERIALIZE_HPP

#include <node.h>
#include <node_object_wrap.h>

#include <string>

class BinarySerialize : public node::ObjectWrap
{
public:
    static void Init(v8::Local<v8::Object> exports);

private:
    explicit BinarySerialize();
    ~BinarySerialize();

    static void New(const v8::FunctionCallbackInfo<v8::Value> &args);
    static v8::Persistent<v8::Function> constructor;

    // js: (string: file where the data should be written)
    static void SetFile(const v8::FunctionCallbackInfo<v8::Value> &args);

private:
    std::string m_file;
};

#endif // BINARYSERIALIZE_HPP
