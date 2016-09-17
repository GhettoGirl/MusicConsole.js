#ifndef BINARYSERIALIZE_HPP
#define BINARYSERIALIZE_HPP

#include <node.h>
#include <node_object_wrap.h>

#include "cereal-predicate.hpp"

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

    // js: [none]
    // return: (bool, whenever the file could be saved or not)
    static void SaveFile(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: (variadic args: string, string, ...)
    // Transforms data into human-unreadable binary form
    static void AddData(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: [none]
    // return: (array[string,string,...]: returns the data in human-readable form)
    static void LoadData(const v8::FunctionCallbackInfo<v8::Value> &args);

private:
    std::string m_file;

    std::vector<std::string> m_priv_data;
    DataRecord m_data;
};

#endif // BINARYSERIALIZE_HPP
