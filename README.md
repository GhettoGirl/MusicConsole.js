# Music Console

A simple console app which organizes all of your media files for fast and easy access.

#### What is Music Console?

**Music Console** is a console application which scans your filesystem for media files. You can search for your favorite songs and videos using simple search terms, the results are opened in a player of your choice.</br>
*Sounds kinda boring?* Don't worry! Music Console has so much features to offer which makes it a unique and powerful tool.


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

This is highly recommended if you plan to use the application on a daily basis. A release distribution contains just the files and node modules which are required for normal use. </br>
To create a release distribution just issue the command `gulp`. You will find the distribution in the `./dist` directory. </br>
To start the application use the provided launcher script `music` you will find in the release directory.

The release dist has the following dependencies:
 - NodeJS 6.5+
 - GNU/Readline
 - TagLib


</br>


## Basics

#### First Start

Starting the program for the first time will create a directory with a configuration file in
```
Linux/FreeBSD/Solaris: $XDG_CONFIG_DIR/GhettoGirl/musicconsole-js
Apple macOS:           ~/Library/Preferences/GhettoGirl/musicconsole-js
```
and than start to scan your `$HOME` folder for media files. If you don't want the home path to be scanned during the first run, see the **command line options** below.

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
 - `4` The library has no media files
 - `5` An instance of **Music Console** is already running


## Command Prompt

*under construction* </br>
**TODO: write the documentation**


