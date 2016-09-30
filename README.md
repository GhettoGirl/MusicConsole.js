# Music Console

![dependencies](https://david-dm.org/GhettoGirl/MusicConsole.js.svg)

A simple console app which organizes all of your media files for fast and easy access.

#### What is Music Console?

**Music Console** is a console application which scans your filesystem for media files. You can search for your favorite songs and videos using simple search terms, the results are opened in a player of your choice.</br>
*Sounds kinda boring?* Don't worry! Music Console has so much features to offer which makes it a unique and powerful tool.

### Features

 - **Over 13 commands** to get the best out of your overload of songs and videos :D
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
</br></br>
 - *Optimal:* **UTF-8** and **24-bit Color** compatible Terminal Emulator </br>
   Music Console works best with 150+ columns. I highly recommend to use a drop-down Terminal for best experience :)

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

**NOTICE!** The documentation is work-in-progress. I want to create something nice and special and easy to read and understand, without any clutter. The old documentation was a catastrophe and I want to avoid it to create another one. Some neat features are still undocumented. You always can read the old documentation.


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

Execute the app using the `-h/--help` parameter to get started. Everything is documented there :)

**NOTICE:** The settings manager is work in progress, at the moment you can only change the library path and commands. Change the other settings manually by editing the configuration file.

#### Exit Codes

 - `0` No error
 - `1` Failed to parse command line
 - `2` Problem in the command list, most likely due to duplicate names
 - `3` The library path isn't valid or accessible
 - `4` The library has no media files
 - `5` Uncaught JavaScript exception
 - `6` Command Mode: no media found

## Command Prompt

The command prompt is the place where you activate all the magic of Music Console ;P

###### Keyboard Interactions

 - `Ctrl+C` (`SIGINT`) cancels the current prompt and starts a new one. Handy if you are to lazy to remove the current line.

###### Arguments

Arguments within `(parenthesis)` are optimal.
 - `type` can be one of `audio`/`video`/`module`

**Pro tip!** Every command can be customized in the settings.

###### One-liner

The prompt has the ability to write one-liner. This means you can execute multiple commands in one go. Commands are separated using a `&&`.

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
This command quits the application. But there is something you should know about it: This command is the only command in the application which needs to match absolutely, which means it will not be executed when you pass arguments to it. This makes it possible to not accidently quit the app when something in your library starts with the word "exit" and you wanna look it up :) </br>
If you need an example here: `EXIT TUNES` will not quit the app but start to search for the phrase in the library.


##### Wait? Did I just saw some commands causing infinite loops?

No worries :) </br>
This are no real infinite loops, you can stop them at any time by hitting Enter. All loops are stoppable.

**Notice:** The default players are `mplayer` and `mpv`. You can stop these players by pressing Enter, which makes them my default choice for this app. When hitting Enter to stop the player it will return to the loop sequence, here you need to hit Enter again if you want to stop the loop. In short: hit Enter twice to get back to the prompt.

**Pro tip!** There is a wait time of a half second before the loop continues. In future releases you will be able to customize this timeout.

*For curious developers:* see `lib/kbhit` for the implementation and how this breakable infinite loop mechanism works.

## Settings

There are a lot of customizable options in Music Console, because everyone is different and prefers different things. Here is a quick overview off all the options and its explanation.

#### × `settings.json` ─ Core Settings

This file contains the core settings. As the file extension says, its a JSON file. It contains the following fields. If the file contains syntax errors it will be destroyed and recreated, watch out for errors before starting Music Console again or keep a backup to not lose your settings. Missing or faulty options will be readded from the defaults.

× `commands` </br>
All command strings. You can modify every command. If there are duplicates, Music Console will tell you and refuses to start. To disable a command just make it empty ;) </br>
**NOTICE!** The `exit` command can not be disabled.

× `library` </br>
Everything related to the library.
  - `rootpath` </br>
    The path which Music Console should scan and use at startup. </br></br>
  - `playlist_paths` </br>
    Is an array of paths where Music Console should look for playlist files using the `plistfile` command. More details are mentioned in the **Playlist** guide below. </br></br>
    `$MUSICCONSOLE_CONFIG_DIR` will be replaced by the configuration directory. </br></br>
  - `prefixdeletionpatterns` </br>
    Is an array of phrases which should be excluded from the search terms of each file. It gives you the possibility to get more relevant results by ignoring common prefixes in your library, like `Music/` or `Videos/`. This phrases are only prefixes and have no support for wildcards or regular expressions. </br></br>
  - `audioformats`/`videoformats`/`moduleformats` </br>
    This are arrays of file extensions which should be recognized as media files. By default this includes a lot of common and uncommon media formats.

× `player` </br>
This are the default players. Every player has a `command` and an array or `arguments` which will be passed to the player. The `%f` is a placeholder which is replaced by the media file. If there is no placeholder in the argument list, it will be added as last argument to the player. </br></br>
Names of the default players are `audioplayer`, `videoplayer` and `modplayer`. You can also have per filetype overrides. For this scroll down to the `players.json` description. It also includes an example.

× `tools` </br>
Contains tools. At the moment the only available tool is a file browser which is used by the `browse` command. The configuration of the tools is identical to the player configuration (`command` and `arguments`). There are 2 placeholders available for tools: `%f` which is replaced by the file and `%d` which is replaced by the directory. If no placeholder is available the file/directory will be used as last argument.

× `prompt` </br>
Customize the prompt and history ignore patterns.
  - `line` </br>
    The string which should be used to display the prompt. In the future this setting will support escape sequences to format this even more (like **bold** or *italic* for example). </br></br>
  - `histignore` </br>
    Array of regular expressions. Every input which matches any of this patterns are not added to the command line history. The regular expressions must be compatible with JavaScript.</br></br>
    **Pro tip!** Lines starting with a space are never added to the history.
  - `histignore_size` </br>
    A counter of last matching items in the history which should never be added to the history file. Makes it possible to prevent a spammy history file with a lot of duplicates. Default is `1`. Set to `0` to append everything to the history, *may the spam be with you* :D

× `randomizer` </br>
This options give you the ability to customize the built-in randomizer which is used by the `random` and `shuffle` command.
  - `historysize` </br>
    The history size is used to remember a fixed amount of numbers which were generated previously by the generator. If any of the number in the history matches the currently generated number a new number will be generated, to prevent infinite loops there is a protection which stops the loop when the maximum possible attempts were made. To disable the memorization, set this value to `0`. Expect the same song/video to play twice in a row without this feature ;)

× `appearance` </br>
Here you can change the display appearance of the media files and what tags should be shown. All this fields have full ANSI escape sequence support. If your terminal emulator supports True Color you can create a rainbow :D </br>
Oh and you can use any kind of character too besides the default fields.
  - `extension`: the file extension.
  - `artist`, `album`, `title`, `genre`: the available tag fields.
  - `path`: the relative path of the media.

All the listed fields above must contain a `%s` which is replaced by the actual value, or leave it away to hide that field. To customize the actual line which is displayed in the terminal you need to modify this 2 fields.
  - `print_tagged`: is used when the media files has at least one tagged field.
  - `print_path`: is used when there are no tags available (mostly videos).

This 2 fields should have the following placeholders which are replaced by the formatted fields from above: `$extension`, `$path`, `$artist`, `$album`, `$title`, `$genre`. You can also add any other characters and phrases which will be printed as static text. </br>
The default configuration is already a great example how to use this feature correctly.

#### × `players.json` ─ Player overrides per filetype

This file contains all player overrides per filetype. Its a JSON file. Besides the default players you can also specify another player for a specific filetype. This is useful if the default player can't handle a specific format. For example `mpv` can't play Bink2 videos, but the official Bink Player can.

The JSON must be structured like this
```json
{
  "extension": {
    "command": "your_player_here",
    "arguments": [
      "--im-a-param",
      "%f"
    ]
  },
  "bk2": {
    "command": "BinkPlayer",
    "arguments": [
      "%f"
    ]
  }
}
```
Where `extension` is, is any filetype which should use another player. If the file contains syntax errors, Music Console will inform you about this. The file stays intact and all player overrides will be unavailable until you fix the file. If the file doesn't exists or is empty it will be recreated with a template to get started easily.

## The Search Algorithm and filter possibilities

Let me describe my search algorithm in detail here, so that you understand what happens under to hood after you hit Enter on the prompt.

The input is just a simple space separated phrase, nothing really special. This simple phrase will be converted to all lowercase characters and then transformed into a case insensitive regular expression. Every space will be converted into a wildcard which matches anything.

But wait there is even more. I talked about advanced filter possibilities earlier. What are those anyway? To fine tune results and to match more than just one pattern I developed a multi-match system. It allows you to enter multiple search terms and combine them in many ways.

The different multi-match types described in detail:

 - **Default** </br>
   This is a regular search term and also the base match when it gets combined with the other types. Nothing much to explain here.


 - **Append To Main Search** (`|a`) </br>
   This type expands the **Default** search term with additional phrases.


 - **Include Into Main Search** (`|w`) </br>
   This type adds a regular search to the multi-match filter. Which means it will either match the **Default** or any of this type.


 - **Without Any Of This** (`|wo`) </br>
   This type allows you to exclude phrases which should not match. Whenever one of the above types match a pattern but also match this one, the search continues until a result is found which doesn't match this type, but one from the above.


 - **Without Genre** (`|wg`) </br>
   Specific to tagged media files. Will exclude every songs of a specific genre.

</br>
Enough theory, now its time for some examples.

1. `初音ミク` </br>
   Will match everything which contains the phrase `初音ミク` in it.
2. `VOCALOID |a 初音ミク |a GUMI` </br>
   This phrase expands to the following array of **Default** types -> </br>
   &nbsp;&nbsp;&nbsp;&nbsp; × `VOCALOID 初音ミク` </br>
   &nbsp;&nbsp;&nbsp;&nbsp; × `VOCALOID GUMI` </br>
   This will match everything which contains one of the 2 phrases in it.
3. `VOCALOID |w BEMANI` </br>
   This will match everything which contains the phrases `VOCALOID` or `BEMANI` in it.
4. `初音ミク |wo VOCALOID` </br>
   This will match everything which contains the phrase `初音ミク`, but **not** the phrase `VOCALOID` in it.

You can combine as much of this multi-match types as you want. Fine tune your search and get the songs and videos you wanna listen and watch to. This system works best for the following commands: `random`, `shuffle` and `playlist`, but you can use them in any command as you wish.

#### Search Term Generators

Search Term Generators are another neat thing which acts under the hood of my search algorithm. Its an attempt to break the complexibility of todays Unicode characters. The work of this generators is to generate a similar or similar-looking phrase for a given input. The given search term will be compared with all generated strings.

There are many scenarios where this makes sense, one of this I want to mention is the chaos and overload of the latin writing system in todays Unicode: there is basic latin, wide latin and a bunch of fancy (examples: ℱ𝓪𝓷𝓬𝔂, 𝕋ℍ𝔼, ᗷY ᗩ), reversed and head over latin characters. Obviously regular matching won't work beyond different variants of the "same" character because it is actually not the same character, it just looks the same.

To break this barrier I made several generators to make it easier to find things in exotic libraries and music/video collections.

 - `Latin` (work-in-progress) </br>
   Converts any latin character to its Unicode counterparts and vise versa. Supports the following variants at the moment: </br>
    × Basic Latin </br>
    × Wide Latin (known in CJK environments)


 - `Kana` </br>
   Converts any japanese kana to its Hiragana, Katakana and Halfwidth Katakana variant. </br>
   `あ` <─> `ア` <─> `ｱ`


 - `Kana Dakuten` </br>
   In Unicode there are kana with the sound marks (dakuten) included and separated. The sound marks are available as standalone combining characters. This generator converts any kana to its kana with dakuten included and separated variant.
   
   **Note:** I added this generator mostly because of different IME behaviors. I own some stuff by myself where kana with the dakuten seperated are used, but my IME uses the kana with the dakuten included.


 - `Whitespace` </br>
   There are over 31+ different whitespace characters in the Unicode table. The most used ones are `0x20` (the regular whitespace character) and `U+3000` (a long whitespace to match CJK characters). This generator converts any known whitespace to a regular whitespace (`0x20`). This generator is the only one I apply to both, the prompt input and the filenames.


In the future I will implement more generators. If you have any ideas or suggestions, let me know :)


