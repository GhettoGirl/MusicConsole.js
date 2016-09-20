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

    // js: [none] (no prompt/reset prompt)
    // js: (string: prompt input line)
    static void SetPrompt(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: [none]
    // invokes readline, returns the input as string
    static void Prompt(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: (string: set history file to use)
    // before the function is not called the history will be disabled
    static void HistorySet(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: [none] (uses the file set before, does nothing if no history file is set)
    // creates a file if not exists and loads all the items from it
    static void HistoryLoad(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: (string: append item to history and flushes the file)
    // there is no separate save function
    static void HistoryAppend(const v8::FunctionCallbackInfo<v8::Value> &args);

    // js: [none] --- returns the whole history as array
    // js: (int: amount of items from the end to return, preserves the order)
    static void HistoryGet(const v8::FunctionCallbackInfo<v8::Value> &args);

private:
    std::string m_prompt;
    std::vector<std::string> m_history;

    std::string m_history_loc;
    std::fstream m_history_file;
    bool m_use_history = false;
};

#endif // GNU_READLINE_HPP
