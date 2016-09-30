#include "readline.hpp"

#include <iostream>
#include <string>

#include <csignal>
#include <setjmp.h>
#include <unistd.h>

#include <readline/readline.h>
#include <readline/history.h>

sigjmp_buf ctrlc_buf;

void on_SIGINT(int)
{
    // for cosmetic reasons :)
    std::endl(std::cout);

    // jump back to prompt
    siglongjmp(ctrlc_buf, 1);
}

void on_TERMINATE(int)
{
    std::endl(std::cout);
    exit(0);
}

std::string ExceptionString(const std::string &method_name, const std::string &msg)
{
    return "GNU/Readline(EXCEPTION, " + method_name + "): " + msg;
}

#define THROW_EXCEPTION(method_name, msg) \
    isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, \
        ExceptionString(method_name, msg).c_str()))); \
    return

using namespace v8;

Persistent<v8::Function> GnuReadline::constructor;

GnuReadline::GnuReadline()
{
}

GnuReadline::~GnuReadline()
{
    m_history.clear();
    m_history_loc.clear();
    m_history_file.close();
}

void GnuReadline::Init(Local<Object> exports)
{
    Isolate *isolate = exports->GetIsolate();

    // Prepare constructor template
    Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
    tpl->SetClassName(String::NewFromUtf8(isolate, "GnuReadline"));
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    NODE_SET_PROTOTYPE_METHOD(tpl, "setPrompt",      SetPrompt);
    NODE_SET_PROTOTYPE_METHOD(tpl, "prompt",         Prompt);
    NODE_SET_PROTOTYPE_METHOD(tpl, "historySet",     HistorySet);
    NODE_SET_PROTOTYPE_METHOD(tpl, "historyLoad",    HistoryLoad);
    NODE_SET_PROTOTYPE_METHOD(tpl, "historyAppend",  HistoryAppend);
    NODE_SET_PROTOTYPE_METHOD(tpl, "historyGet",     HistoryGet);

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

void GnuReadline::SetPrompt(const FunctionCallbackInfo<Value> &args)
{
    GnuReadline *obj = ObjectWrap::Unwrap<GnuReadline>(args.Holder());

    // custom prompt requested, otherwise nothing is used
    if (args.Length() != 0)
    {
        String::Utf8Value param(args[0]->ToString());
        obj->m_prompt = std::string(*param);
    }

    else
    {
        obj->m_prompt.clear();
    }
}

void GnuReadline::Prompt(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    GnuReadline *obj = ObjectWrap::Unwrap<GnuReadline>(args.Holder());

    // register interrupt signal for address jumper
    std::signal(SIGINT, on_SIGINT);

    // register terminate signals for programm termination
    std::signal(SIGTERM, on_TERMINATE);
    std::signal(SIGQUIT, on_TERMINATE);
    std::signal(SIGHUP,  on_TERMINATE);
    std::signal(SIGABRT, on_TERMINATE);

    // register jump address
    while (sigsetjmp(ctrlc_buf, 1) != 0);

    // the check is required, otherwise the stdlib will throw a std::logic_error
    //                             --- basic_string::_M_construct null not valid
    // when the node process receives the TERM signal
    std::string input;
    char *buf = readline(obj->m_prompt.c_str());
    input = buf ? std::string(buf) : "";

    args.GetReturnValue().Set(String::NewFromUtf8(isolate, input.c_str()));

    // restore original signal handlers
    std::signal(SIGINT, SIG_DFL);
    std::signal(SIGTERM, SIG_DFL);
    std::signal(SIGQUIT, SIG_DFL);
    std::signal(SIGHUP, SIG_DFL);
    std::signal(SIGABRT, SIG_DFL);
}

void GnuReadline::HistorySet(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    GnuReadline *obj = ObjectWrap::Unwrap<GnuReadline>(args.Holder());

    if (args.Length() != 1)
    {
        THROW_EXCEPTION("historySet", "Takes only 1 parameter, which must be a string!");
    }

    String::Utf8Value param(args[0]->ToString());
    std::string file_path = std::string(*param);
    obj->m_history_loc = file_path;
    file_path.clear();

    obj->m_history_file.open(obj->m_history_loc.c_str(),
        std::ios_base::out | std::ios_base::in | std::ios_base::app);
    obj->m_history_file.close();

    obj->m_use_history = true;
}

void GnuReadline::HistoryLoad(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    GnuReadline *obj = ObjectWrap::Unwrap<GnuReadline>(args.Holder());

    if (obj->m_use_history)
    {
        std::string line;
        obj->m_history.clear();

        obj->m_history_file.open(obj->m_history_loc.c_str(),
            std::ios_base::out | std::ios_base::in | std::ios_base::app);
        while (std::getline(obj->m_history_file, line))
        {
            add_history(line.c_str());
            obj->m_history.push_back(line);
        }
        obj->m_history_file.close();

        line.clear();
    }

    else
    {
        THROW_EXCEPTION("historyLoad", "History is disabled, call 'historySet' first!");
    }
}

void GnuReadline::HistoryAppend(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    GnuReadline *obj = ObjectWrap::Unwrap<GnuReadline>(args.Holder());

    if (obj->m_use_history)
    {
        if (args.Length() != 1)
        {
            THROW_EXCEPTION("historyAppend", "Takes only 1 parameter, which must be a string!");
        }

        String::Utf8Value param(args[0]->ToString());
        std::string item = std::string(*param);

        add_history(item.c_str());
        obj->m_history.push_back(item);

        obj->m_history_file.open(obj->m_history_loc.c_str(),
            std::ios_base::out | std::ios_base::in | std::ios_base::app);
        obj->m_history_file << item << '\n' << std::flush;
        obj->m_history_file.close();
    }

    else
    {
        THROW_EXCEPTION("historyAppend", "History is disabled, call 'historySet' first!");
    }
}

void GnuReadline::HistoryGet(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    GnuReadline *obj = ObjectWrap::Unwrap<GnuReadline>(args.Holder());

    if (obj->m_use_history)
    {
        int num_of_elem = -1;

        if (args.Length() > 0)
        {
            num_of_elem = args[0]->ToInteger()->Value();
        }

        if (num_of_elem == -1)
        {
            Local<Array> items = Array::New(isolate, obj->m_history.size());
            for (unsigned i = 0; i < obj->m_history.size(); i++)
            {
                items->Set(i, String::NewFromUtf8(isolate, obj->m_history.at(i).c_str()));
            }

            args.GetReturnValue().Set(items);
        }

        else
        {
            while (num_of_elem > static_cast<int>(obj->m_history.size()))
            {
                num_of_elem--;
            }

            std::vector<std::string> last_elem;

            for (unsigned i = obj->m_history.size() - num_of_elem;
                 i < obj->m_history.size(); i++)
            {
                last_elem.push_back(obj->m_history.at(i));
            }

            Local<Array> items = Array::New(isolate, num_of_elem);
            for (unsigned i = 0; i < last_elem.size(); i++)
            {
                items->Set(i, String::NewFromUtf8(isolate, last_elem.at(i).c_str()));
            }

            last_elem.clear();

            args.GetReturnValue().Set(items);
        }
    }

    else
    {
        THROW_EXCEPTION("historyGet", "History is disabled, call 'historySet' first!");
    }
}
