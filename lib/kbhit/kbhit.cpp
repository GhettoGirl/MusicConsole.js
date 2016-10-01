#include <node.h>

#include <iostream>

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

// Waits a specific time for user response to break out of a(n) (infinite) loop.
// Break key == Carriage Return [ONLY]

void kbhit(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();

#ifdef _WIN32

    usleep(500000);
    args.GetReturnValue().Set(Integer::New(isolate, kbhit()));

#else

    struct timeval tv;
    fd_set fds;
    tv.tv_sec = 0; // seconds
    tv.tv_usec = 500000; // microseconds
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
    NODE_SET_METHOD(exports, "kbhit", kbhit);
    NODE_SET_METHOD(exports, "getchar", getchar);
}

NODE_MODULE(kbhit, Init)
