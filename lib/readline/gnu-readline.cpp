#include "gnu-readline.hpp"

#include <iostream>
#include <algorithm>
#include <iterator>

#include <unistd.h>
#include <readline/readline.h>
#include <readline/history.h>

// personal todo: read the V8 documentation and Node C++ addon docs
// https://nodejs.org/api/addons.html#addons_wrapping_c_objects

// todo:
//  - data type checking, to prevent undefined behavior
//  - proper error handling
//    at the moment stuff is rather complicated :/

// what works:
//  - basic readline
//  - readline history + history saving and loading
//

void LogWarn(const std::string &method_name, const char *msg)
{
    std::cerr << "GNU/Readline(WARN, " << method_name << "): " << msg << std::endl;
}

std::string ExceptionString(const std::string &method_name, const std::string &msg)
{
    return "GNU/Readline(EXCEPTION, " + method_name + "):\n    " + msg;
}

#define LOG_WARN(msg) \
    LogWarn(method_name, msg)

#define THROW_EXCEPTION(msg) \
    isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, \
        ExceptionString(method_name, msg).c_str()))); \
    return

using namespace v8;

// note: 'Function' conflicts with something else somewhere
//       use 'v8::Function' explicitly

Persistent<v8::Function> GnuReadline::constructor;

GnuReadline::GnuReadline()
{
}

GnuReadline::~GnuReadline()
{
    m_history_loc.clear();
    m_history_file.close();
}

void GnuReadline::Init(Local<Object> exports)
{
    Isolate *isolate = exports->GetIsolate();

    // Prepare constructor template
    Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
    tpl->SetClassName(String::NewFromUtf8(isolate, "GnuReadline"));
    tpl->InstanceTemplate()->SetInternalFieldCount(4);

    // Prototype
    NODE_SET_PROTOTYPE_METHOD(tpl, "prompt",         Prompt);
    NODE_SET_PROTOTYPE_METHOD(tpl, "historySet",     HistorySet);
    NODE_SET_PROTOTYPE_METHOD(tpl, "historyLoad",    HistoryLoad);
    NODE_SET_PROTOTYPE_METHOD(tpl, "historyAppend",  HistoryAppend);

    constructor.Reset(isolate, tpl->GetFunction());
    exports->Set(String::NewFromUtf8(isolate, "GnuReadline"), tpl->GetFunction());
}

void GnuReadline::New(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

    if (args.IsConstructCall())
    {
        // Invoked as constructor: `new GnuReadline(...)`
        GnuReadline *obj = new GnuReadline();
        obj->Wrap(args.This());
        args.GetReturnValue().Set(args.This());
    }

    else
    {
        // Invoked as plain function `GnuReadline(...)`, turn into construct call.
        const int argc = 1;
        Local<Value> argv[argc] = { args[0] };
        Local<Context> context = isolate->GetCurrentContext();
        Local<v8::Function> cons = Local<v8::Function>::New(isolate, constructor);
        Local<Object> result = cons->NewInstance(context, argc, argv).ToLocalChecked();
        args.GetReturnValue().Set(result);
    }
}

void GnuReadline::Prompt(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    //GnuReadline *obj = ObjectWrap::Unwrap<GnuReadline>(args.Holder());

    static const std::string method_name = "prompt";

    if (args.Length() >= 2)
    {
        LOG_WARN("To many arguments given. Unnecessary!");
    }

    std::string prompt;

    // custom prompt requested, otherwise nothing is used
    if (args.Length() != 0)
    {
        // note: converts even numbers to strings
        // fixme: check if its really a string
        String::Utf8Value param(args[0]->ToString());
        prompt = std::string(*param);
    }

    args.GetReturnValue().Set(String::NewFromUtf8(isolate,
        readline(prompt.c_str())
    ));

    prompt.clear();
}

void GnuReadline::HistorySet(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    GnuReadline *obj = ObjectWrap::Unwrap<GnuReadline>(args.Holder());

    static const std::string method_name = "historySet";

    if (args.Length() != 1)
    {
        THROW_EXCEPTION("Takes only 1 parameter, which must be a string!");
    }

    // fixme: check if its really a string
    String::Utf8Value param(args[0]->ToString());
    std::string file_path = std::string(*param);
    obj->m_history_loc = file_path;
    file_path.clear();

    obj->m_history_file.open(obj->m_history_loc.c_str(),
        std::ios_base::out | std::ios_base::in | std::ios_base::app);
    obj->m_history_file.close();
}

void GnuReadline::HistoryLoad(const FunctionCallbackInfo<Value> &args)
{
    //Isolate *isolate = args.GetIsolate();
    GnuReadline *obj = ObjectWrap::Unwrap<GnuReadline>(args.Holder());

    static const std::string method_name = "historyLoad";

    std::vector<std::string> history;

    obj->m_history_file.open(obj->m_history_loc.c_str(),
        std::ios_base::out | std::ios_base::in | std::ios_base::app);
    std::copy(std::istream_iterator<std::string>(obj->m_history_file),
         std::istream_iterator<std::string>(),
         std::back_inserter(history));
    obj->m_history_file.close();

    for (const std::string &item : history)
    {
        add_history(item.c_str());
    }

    history.clear();
}

void GnuReadline::HistoryAppend(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    GnuReadline *obj = ObjectWrap::Unwrap<GnuReadline>(args.Holder());

    static const std::string method_name = "historyAppend";

    if (args.Length() != 1)
    {
        THROW_EXCEPTION("Takes only 1 parameter, which must be a string!");
    }

    String::Utf8Value param(args[0]->ToString());
    std::string item = std::string(*param);

    add_history(item.c_str());

    obj->m_history_file.open(obj->m_history_loc.c_str(),
        std::ios_base::out | std::ios_base::in | std::ios_base::app);
    obj->m_history_file << item << '\n' << std::flush;
    obj->m_history_file.close();
}
