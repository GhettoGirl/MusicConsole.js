#include <node.h>

#include <iostream>
#include <readline/readline.h>

// personal todo: read the V8 documentation and Node C++ addon docs
// https://nodejs.org/api/addons.html#addons_wrapping_c_objects

// todo:
//  - implement the history feature of readline
//  - convert THIS to a JS "class"???
//  - add user settings, like where to store the history file, etc.
//  - data type checking, to prevent undefined behavior
//  - proper error handling
//    at the moment stuff is rather complicated :/

// what works:
//  - basic readline
//

enum NoticeType {
    WARN,              // Just print something to terminal (stderr)
    ERROR              // Throw JavaScript exception for proper handling in the script
};

void LogNotice(NoticeType type, const std::string &method_name, const char *msg)
{
    std::string notice_type;
    switch (type)
    {
        case WARN:
            notice_type = "WARN";
            break;
        case ERROR:
            notice_type = "ERROR";
            break;
        default:
            notice_type = "UNDEFINED";
            break;
    }

    std::cerr << "GNU/Readline(" << method_name << ", " << notice_type << "): " << msg << std::endl;
}

#define LOG_NOTICE(type, msg) \
    LogNotice(type, method_name, msg)

using namespace v8;

void Prompt(const FunctionCallbackInfo<Value> &args)
{
    static const std::string method_name = "prompt";

    if (args.Length() >= 2)
    {
        LOG_NOTICE(WARN, "To many arguments given. Unnecessary!");
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

    Isolate *isolate = args.GetIsolate();
    args.GetReturnValue().Set(String::NewFromUtf8(isolate,
        readline(prompt.c_str())
    ));
}

void init(Local<Object> exports)
{
    NODE_SET_METHOD(exports, "prompt", Prompt);
}

NODE_MODULE(gnu_readline, init)
