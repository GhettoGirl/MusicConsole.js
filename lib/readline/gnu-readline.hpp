#ifndef GNU_READLINE_HPP
#define GNU_READLINE_HPP

#include <node.h>
#include <node_object_wrap.h>

#include <string>
#include <vector>
#include <fstream>

class GnuReadline : public node::ObjectWrap
{
public:
    static void Init(v8::Local<v8::Object> exports);

private:
    explicit GnuReadline();
    ~GnuReadline();

    static void New(const v8::FunctionCallbackInfo<v8::Value> &args);
    static v8::Persistent<v8::Function> constructor;

    // js: [none] (no prompt)
    // js: (string: prompt input line)
    static void Prompt(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: (string: set history file to use -> m_history_loc)
    // must be called first
    static void HistorySet(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: [none] (take location from m_history_loc)
    // creates a file if not exists and loads all the items from it
    static void HistoryLoad(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: (string: append item to history and flushes the file)
    static void HistoryAppend(const v8::FunctionCallbackInfo<v8::Value> &args);

private:
    std::string m_history_loc;
    std::fstream m_history_file;
};

#endif // GNU_READLINE_HPP
