# Music Console

A simple console app which organizes all of your media files for fast and easy access.

#### What is it?

**Music Console** is a console application which scans your filesystem for media files and stores a list in memory. You can search this list using a simple search term, the first match is opened in a player of your choice.</br>
*Sounds kinda boring?* Don't worry! Music Console has so much features to offer which makes it unique.

</br>

**PLEASE NOTE THE DEV NOTICE BELOW, BEFORE CONTINUE READING**

</br>

## Requirements

 - OS: anything UN*X-related (Linux, *BSD, macOS, etc.) [there is no Windows support]
</br></br>
 - [NodeJS](https://www.nodejs.org) 6.5+ and `npm`
 - [node-gyp](https://github.com/nodejs/node-gyp): to build the native addons </br>
   Install with `npm install -g node-gyp` (if it not comes bundled with `npm` already) </br>
   *C++11 compiler required*
 - GNU/[Readline](http://ftp.gnu.org/gnu/readline/) ─ for the prompt
 - [TagLib](https://taglib.github.io/) 1.10+ (1.11 highly recommended) ─ for the tag reader

#### Building

 - Run `npm install` to install and build all dependencies. </br>
   If this command doesn't build the native C++ addons for some reason, run `node-gyp configure build`.

> The native addons are copied to `./lib`. You can issue `node-gyp clean` to delete the build directory and still have the modules in place. The modules are re-copied each time you issue `node-gyp build` so no worries about outdated code.

#### Running

 - Just issue `node .` to execute the application.

I will create a proper install and run script in the future.

</br></br></br>


## Basics

#### Exit Codes

 - `0` No error
 - `1` *`<unused>`*
 - `2` Problem in the command list, most likely due to duplicate names
 - `3` *`<unused>`*
 - `4` *`<unused>`*
 - `5` An instance of **Music Console** is already running


## ~ Dev Notice ~

This project is a continuation of my old [Music Console](https://github.com/GhettoGirl/MusicConsole) written in C++14 and Qt5. I'm in the progess of learning NodeJS and Electron for any of my apps I will write in the future. C++ for GUI development got too lazy for me and it takes way too long. I need something future proof and Node/Electron got really popular these days.

For learning purposes and to gain experience in JavaScript, I decided to rewrite one of my favorite tools in Node. And not just rewrite it, but also improve it from the ground up :grinning:

At the moment there isn't anything interesting in here. If you are interested in this app, head over to the old C++ version and use that. Make sure to regulary check back here, since the C++ version is deprecated and shouldn't be used anymore in the future.
