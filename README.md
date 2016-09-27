# Music Console

A simple console app which organizes all of your media files for fast and easy access.

#### What is Music Console?

**Music Console** is a console application which scans your filesystem for media files. You can search for your favorite songs and videos using simple search terms, the results are opened in a player of your choice.</br>
*Sounds kinda boring?* Don't worry! Music Console has so much features to offer which makes it a unique and powerful tool.

### Features

 - **Over 14 commands** to get the best out of your overload of songs and videos :D
 - **Name filters** for audio, video and module tracker formats
 - **Advanced search algorithm** and **filter** to find exactly what you want
 - **Customizable players** to play every song and video in the player of your choice
 - **Command line history** for those with a bad memory :P
 - **Real-time playlist generator** to autogenerate a playlist real quick
 - **Custom Playlist format** to create awesome playlists, the sky is the limit
 - **Shuffle** randomly through all of your songs and videos
 - **Play random** songs and videos. YOLO
 - **Minimalistic and customizable** terminal output to avoid unnecessary clutter while you listen to your favorite songs
 - A **cache mechanism** to avoid unnecessary long startup times for the lazy people out there


## Requirements

 - OS: anything UN\*X-related (Linux, \*BSD, macOS, etc.) </br>
   [there is no Windows support at the moment (*WIP*)]
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

To clear the build tree, issue `gulp clean` or remove the `./build` directory manually.

#### Running

 - Just issue `node .` to execute the application.

### Creating a release distribution

This is highly recommended if you plan to use the application on a daily basis. A release distribution contains just the files and node modules which are required for normal use. </br>
To create a release distribution just issue the command `gulp`. You will find the distribution in the `./dist` directory. </br>
To start the application, use the provided launcher script `music` you will find in the release directory.

The release dist has the following dependencies:
 - NodeJS 6.5+
 - GNU/Readline
 - TagLib

Make sure to checkout the [**Releases**](https://github.com/GhettoGirl/MusicConsole.js/releases) for prebuilt distributions ready for you to use.

</br>


## Basics

**NOTICE!** The documentation is work-in-progress. I want to create something nice and special and easy to read and understand, without any clutter. The old documentation was a catastrophe and I want to avoid to create another one.


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

**NOTICE:** The settings manager is work in progress, at the moment you can only change the library path. Change the other settings manually by editing the configuration file.

#### Exit Codes

 - `0` No error
 - `1` Failed to parse command line, or JavaScript exception
 - `2` Problem in the command list, most likely due to duplicate names
 - `3` The library path isn't valid or accessible
 - `4` The library has no media files
 - `5` An instance of **Music Console** is already running


## Command Prompt

The command prompt is the place where you can active all the magic of Music Console ;P </br>

###### Keyboard Interactions

 - `Ctrl+C` (`SIGINT`) cancels the current prompt and starts a new one. Handy if you are to lazy to remove the current one.
 - `Ctrl+D` quits the app when the prompt is empty, otherwise does nothing.

###### Arguments

Arguments within `(parenthesis)` are optimal.
 - `type` can be one of `audio`/`video`/`module`

**Pro tip!** Every command can be customized in the settings.

#### Commands

× *(nothing)* </br>
By omitting a command you can directly search for matching media files using the entered search term. The result will be played in the audio player.

× `audio` *search term* </br>
Search only for audio files, result will be played in the audio player.

× `video` *search term* </br>
Search only for video files, result will by played in the video player.

× `module` *search term* </br>
Search only for module tracker files, result will be played in the mod player.

× `search` (`type`) *search term* </br>
Searches for media files maching the given search term and prints all results on screen. Can by filtered by media format.

× `browse` </br>
Invokes the configured file browser in the library path. Default is Midnight Commander.

× `random` (`type`) (*search term*) </br>
Plays a random media in the audio player. When specifying a type the results are limited and will be played in the corresponding player. To filter the results and gain some control of what should be played, specify search terms.

× `shuffle` (`type`) (*search term*) </br>
Shuffles randomly through your library. By default the audio player is used. Specify a type and search terms to fine tune the results.

× `repeat` (`type`) *search term* </br>
Repeats the same media over and over again.

× `history` </br>
Prints the command line history on screen.

× `statistics` </br>
Shows you some details about your library, like the number of songs, videos and module tracker you own or what file types are configured.

× `rescan` </br>
Rescans your library when it has been changed without leaving the app.

× `playlist` (`type`) *search term* </br>
Generates a playlist of songs and videos which matches the given search terms. By default the audio player is used. Provide a type to change the player.

× `plistfile` *playlist name* </br>
Loads the given Music Console Playlist and plays all entries. See the **Playlist** guide below how to work with playlists.

× `clear` </br>
Clears all output from the terminal and prints the header again.

× `exit` </br>
You know what it does :P
