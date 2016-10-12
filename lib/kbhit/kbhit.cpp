#include <node.h>
#include <iostream>

// == kbhit ==
// Waits a specific time for user response to break out of a(n) (infinite) loop.
// Break key == Carriage Return [ONLY]

#ifdef _WIN32
#include <windows.h>
#include <conio.h>
void usleep(__int64 usec)
{
    HANDLE timer;
    LARGE_INTEGER ft;

    ft.QuadPart = -(10 * usec); // Convert to 100 nanosecond interval, negative value indicates relative time

    timer = CreateWaitableTimer(NULL, TRUE, NULL);
    SetWaitableTimer(timer, &ft, 0, NULL, NULL, 0);
    WaitForSingleObject(timer, INFINITE);
    CloseHandle(timer);
}
#else
#include <unistd.h>
#include <sys/ioctl.h>
#include <sys/select.h>
#endif

using namespace v8;

// sets the sleep interval, use a function here to prevent unnecessary recalculation of the value each time
int sleep_interval = 500000; // 0.5s, default
void set_sleep_interval(const FunctionCallbackInfo<Value> &args)
{
    if (args.Length() > 0)
    {
        double val = args[0]->NumberValue();

        // allow a minimum of 0.15s, everything below is way too short
        if (val >= 0.15)
        {
            // 1s = 1e+6µs
            sleep_interval = val * 1e+6;
        }
    }
}

void kbhit(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

#ifdef _WIN32

    usleep(sleep_interval);
    args.GetReturnValue().Set(Integer::New(isolate, kbhit()));

#else

    struct timeval tv;
    fd_set fds;
    tv.tv_sec = 0; // seconds
    tv.tv_usec = sleep_interval; // microseconds
    FD_ZERO(&fds);
    FD_SET(STDIN_FILENO, &fds); // STDIN_FILENO is 0
    select(STDIN_FILENO+1, &fds, NULL, NULL, &tv);

    args.GetReturnValue().Set(Integer::New(isolate, FD_ISSET(STDIN_FILENO, &fds)));

#endif
}

// must be called after every instance of kbhit() to clear the input buffer
// otherwise the program will receive a carriage return which may affect
// futher functionality depending on what kind of things the program is doing
void getchar(const FunctionCallbackInfo<Value> &args)
{
    std::cin.clear();
    std::cin.get();
}

void Init(Local<Object> exports)
{
    NODE_SET_METHOD(exports, "set_sleep_interval", set_sleep_interval);
    NODE_SET_METHOD(exports, "kbhit", kbhit);
    NODE_SET_METHOD(exports, "getchar", getchar);
}

NODE_MODULE(kbhit, Init)
