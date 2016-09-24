# Music Console

A simple console app which organizes all of your media files for fast and easy access.

#### What is Music Console?

**Music Console** is a console application which scans your filesystem for media files and stores a list in memory. You can search this list using a simple search term, the first match is opened in a player of your choice.</br>
*Sounds kinda boring?* Don't worry! Music Console has so much features to offer which makes it unique.

</br>

**PLEASE NOTE THE DEV NOTICE BELOW, BEFORE CONTINUE READING**

## ~ Dev Notice ~

This project is a continuation of my old [Music Console](https://github.com/GhettoGirl/MusicConsole) written in C++14 and Qt5. I'm in the progess of learning NodeJS and Electron for any of my apps I will write in the future. C++ for GUI development got too lazy for me and it takes way too long. I need something future proof and Node/Electron got really popular these days.

For learning purposes and to gain experience in JavaScript, I decided to rewrite one of my favorite tools in Node. And not just rewrite it, but also improve it from the ground up :grinning:

At the moment there isn't anything interesting in here. If you are interested in this app, head over to the old C++ version and use that. Make sure to regulary check back here, since the C++ version is deprecated and shouldn't be used anymore in the future.

This rewrite will be finished soon™ :)

</br></br>


## Requirements

 - OS: anything UN*X-related (Linux, *BSD, macOS, etc.) [there is no Windows support]
</br></br>
 - [NodeJS](https://www.nodejs.org) 6.5+ and `npm`
 - [node-gyp](https://github.com/nodejs/node-gyp): to build the native addons </br>
   Install with `npm install -g node-gyp` (if it not comes bundled with `npm` already) </br>
   *C++11 compiler required*
 - [Gulp](https://www.npmjs.com/package/gulp) ─ for the installer
 - GNU/[Readline](http://ftp.gnu.org/gnu/readline/) ─ for the prompt; yes you read right, I'm using GNU/Readline together with NodeJS
 - [TagLib](https://taglib.github.io/) 1.10+ (1.11 highly recommended) ─ for the tag reader

#### Building

 - Run `npm install` to install and build all dependencies. </br>
   If this command doesn't build the native C++ addons for some reason, run `node-gyp configure build`.

> The native addons are copied to `./lib`. You can issue `node-gyp clean` to delete the build directory and still have the modules in place. The modules are re-copied each time you issue `node-gyp build` so no worries about outdated code.

#### Running

 - Just issue `node .` to execute the application.

### Creating a release distribution

This is highly recommended if you plan to use the application on a daily basis. A release distribution contains just the files and node modules which are required for normal use.

To create a release distribution just issue the command `gulp`. You will find the distribution in the `./dist` directory.

To start the application use the provided launcher script `music` you will find in the release directory.

</br></br></br>


## Basics

#### First Start

Starting the program for the first time will create a directory with a configuration file in
```
$XDG_CONFIG_DIR/GhettoGirl/musicconsole-js
```
and than start to scan your `$HOME` folder for media files.

The first start, depending on how much music and videos you own, can take up to 3 minutes.
During this process *Music Console* is searching for media files, reading tags and generating advanced
search terms for convenient lookups in the prompt. All this data is written to the cache,
which will be re-used every time you startup the program. This means the second startup
is more or less instant ─ because Music Console only needs to scan the filesystem for media
files and than greps all the generated content from the cache.

You can manually rescan the filesystem if your library has changed using the `rescan` command.
The rescan process repeats the scan and uses data from the cache if any.

#### Command line options

Command line options are only used to change settings. There are no plans for an interactive
settings manager.

Execute the app using the `-h/--help` parameter to get started.

#### Exit Codes

 - `0` No error
 - `1` Failed to parse command line
 - `2` Problem in the command list, most likely due to duplicate names
 - `3` The library path isn't valid or accessible
 - `4` *`<unused>`*
 - `5` An instance of **Music Console** is already running

