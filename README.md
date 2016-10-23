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

 - OS: anything UN\*X-related (Linux, \*BSD, macOS, etc.) or Windows (only Windows 10 was tested)
</br></br>
 - [NodeJS](https://www.nodejs.org) 6.5+ and `npm`
 - [node-gyp](https://github.com/nodejs/node-gyp): to build the native addons </br>
   Install with `npm install -g node-gyp` (if it not comes bundled with `npm` already) </br>
   *C++11 compiler required*
 - [Gulp](https://www.npmjs.com/package/gulp) ─ for the installer
 - GNU/[Readline](http://ftp.gnu.org/gnu/readline/) ─ for the prompt; yes you read right, I'm using GNU/Readline together with NodeJS </br>
   *not required when building on Windows*; on Windows [**WinEditline**](http://mingweditline.sourceforge.net/) is used (bundled)
 - [TagLib](https://taglib.github.io/) 1.10+ (1.11 highly recommended) ─ for the tag reader </br>
   *disabled on Windows, so not required there*
</br></br>
 - *Optimal:* **UTF-8** and **24-bit Color** compatible Terminal Emulator </br>
   Music Console works best with 150+ columns. I highly recommend to use a drop-down Terminal for best experience :)
 - *Recommended Player:* [**MPV**](https://mpv.io/) </br>
   This is the default player of Music Console and also the player I use. I can only recommend it. Of course you can use any player of your choice :)

##### Notes about Windows

Music Console is functional under Windows with very limited functionality. I will not support this OS due to the lack of proper Unicode and Color support in the Terminal. There are many bugs and the Tag Reader is disabled. The media player controller is not very stable and there is also no signal handling (blame Microsoft not me). Developing command line apps for Windows is not fun at all. Don't expect very much from this app when you use Windows.

Using a UN\*X-related system is highly recommended.


#### Building

 - Run `npm install` to install and build all dependencies. </br>
   If this command doesn't build the native C++ addons for some reason, run `node-gyp configure build`.

> The native addons are copied to `./lib`. You can issue `node-gyp clean` to delete the build directory and still have the modules in place. The modules are re-copied each time you issue `node-gyp build` so no worries about outdated code.
>
> **Please note:** on Windows you need to manually copy all `*.node` files from the `build/Release` directory to the `./lib` directory, because the copy target is ignored during the build process. I don't know how to fix this :(

To clear the build tree, issue `gulp clean` or remove the `./build` directory manually.

#### Running

 - Just issue `node .` to execute the application.

### Creating a release distribution

This is highly recommended if you plan to use the application on a daily basis. A release distribution contains just the files and node modules which are required for normal use. </br>
To create a release distribution just issue the command `gulp`. You will find the distribution in the `./dist` directory. </br>
To start the application, use the provided launcher script `music` you will find in the release directory.

The release dist has the following dependencies:
 - NodeJS 6.5+
 - GNU/Readline (*not on Windows*)
 - TagLib (*not on Windows*)

Make sure to checkout the [**Releases**](https://github.com/GhettoGirl/MusicConsole.js/releases) for prebuilt distributions ready for you to use.

</br>


## Basics


#### First Start

Starting the program for the first time will create a directory with the configuration files in
```
Linux/FreeBSD/Solaris: $XDG_CONFIG_HOME/GhettoGirl/musicconsole-js
Apple macOS:           ~/Library/Preferences/GhettoGirl/musicconsole-js
Windows:               %LOCALAPPDATA%/GhettoGirl/musicconsole-js
```
and than start to scan your `$HOME`/`%USERPROFILE%` folder for media files. If you don't want the home path to be scanned during the first run, see the **command line options** below.

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

The prompt has the ability to expand one-liner. This means you can execute multiple commands in one go. Commands are separated using `&&`.

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
Searches for media files matching the given search term and prints all results on screen. Can by filtered by media format.

× `browse` </br>
Invokes the configured file browser in the library path. Default is Midnight Commander. In graphical environments I recommend to set this to `xdg-open` (or alternatives) or `open` (macOS) to launch the default graphical file browser. This commands has the advantage that they open the browser in background and doesn't block the app from continuous usage.

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

× `plistfile` (subcommand) *playlist name* </br>
Loads the given Music Console Playlist and plays all entries. If the argument matches the subcommand `plistlist` (default value = `list`) it will display all available playlists in all given directories. On the subcommand `plistview` (default value = `view`) it will display all entries of the given playlist file; at the moment there is no way to tell if an entry is a *random* (`R`) or *file* (`F`) entry.

See the **Playlist** guide below how to work with playlists.

× `clear` </br>
Clears all output from the terminal and prints the header again.

× `exit` </br>
This command quits the application. But there is something you should know about it: This command is the only command in the application which needs to match absolutely, which means it will not be executed when you pass arguments to it. This makes it possible to not accidently quit the app when something in your library starts with the word "exit" and you wanna look it up :) </br>
If you need an example here: `EXIT TUNES` will not quit the app but start to search for the phrase in the library.


##### Wait? Did I just saw some commands causing infinite loops?

No worries :) </br>
This are no real infinite loops, you can stop them at any time by hitting Enter. All loops are stoppable.

**Notice:** The default player is `mpv`. You can stop this player by hitting Enter, which makes it my default choice for this app. When hitting Enter to stop the player it will return to the loop sequence, here you need to hit Enter again if you want to stop the loop. In short: hit Enter twice to get back to the prompt.

**Pro tip!** There is a wait time of a half second before the loop continues. The timeout can be customized in the settings.

*For curious developers:* see [`lib/kbhit`](./lib/kbhit) for the implementation and how this breakable infinite loop mechanism works.

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
  - `movetobottomphrases` </br>
    Is an array of phrases which should move matching filenames to the bottom of the internal filelist to manipulate its order. This is useful for example to move instrumental tracks behind its vocal tracks so that you need to explicitly add `instrumental` to the search term to play that track. As default this array has already some common phrases which indicate instrumental tracks. </br></br>
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
    The string which should be used to display the prompt. The use of escape sequences is supported here. </br></br>
    **Be aware** that you need to wrap all escape sequences inside `\\001` (start) and `\\002` (end) to tell the prompt to ignore this characters. This has something to do with line wrapping and the history. If you don't do that, than expect strange display issues. </br></br>
    Example, without escape sequences: `"# "` -> shows as <code>#&nbsp;</code></br>
    Example, with escape sequences: `"\\001\\x1b[1;38;2;0;171;233m\\002# \\001\\x1b[0m\\x1b[38;2;0;97;167m\\002"` -> shows as <code>#&nbsp;</code>, while the 
   `#` has a different color than the rest of the prompt. If you forget the `\\001` and `\\002` here than the prompt will think the characters used to create the escape sequence are part of the line and this will cause display issues later, because escape sequences takes up no physical space, but the prompt expects actual characters there.</br></br>
  - `histignore` </br>
    Array of regular expressions. Every input which matches any of this patterns are not added to the command line history. The regular expressions must be compatible with JavaScript.</br></br>
    **Pro tip!** Lines starting with a space are never added to the history.</br></br>
  - `histignore_size` </br>
    A counter of last matching items in the history which should never be added to the history file. Makes it possible to prevent a spammy history file with a lot of duplicates. Default is `1`. Set to `0` to append everything to the history, *may the spam be with you* :D</br></br>
  - `sleep_interval` </br>
    This is the time in **seconds** how long the commands `shuffle`, `playlist`, etc. should wait before playing the next entry. The default value is `0.5` seconds. You can use any amount of seconds here ─ please note that the *minimum* possible value is `0.15` seconds, everything below this value is too fast and you will most likely not be able to cancel any loops with it. The sleep interval will reset to `0.5` in this case. </br></br>
    **Pro tip!** For faster loops a value of `0.3` or `0.25` is recommended.

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
   Converts any Latin character to its Unicode counterparts and vise versa. Supports the following variants at the moment: </br>
    × Basic Latin </br>
    × Wide Latin (found in CJK environments)


 - `Kana` </br>
   Converts any Japanese Kana to its Hiragana, Katakana and Halfwidth Katakana variant. </br>
   `あ` <─> `ア` <─> `ｱ`


 - `Kana Dakuten` </br>
   In Unicode there are Kana with the sound marks (dakuten) included and separated. The sound marks are available as standalone combining characters. This generator converts any Kana to its Kana with dakuten included and separated variant.
   
   **Note:** I added this generator mostly because of different IME behaviors. I own some stuff by myself where Kana with the dakuten seperated are used, but my IME uses the Kana with the dakuten included.


 - `Whitespace` </br>
   There are over 31+ different whitespace characters in the Unicode table. The most used ones are `0x20` (the regular whitespace character) and `U+3000` (a long whitespace to match CJK characters). This generator converts any known whitespace to a regular whitespace (`0x20`). This generator is the only one I apply to both, the prompt input and the filenames.


In the future I will implement more generators. If you have any ideas or suggestions, let me know :)


## Playlists

Music Console comes with its own easy-to-use and customizable playlist format. While the playlist generator is very limited you can do so much more by creating a playlist manually.

Playlists can be stored where you want them to be, just tell Music Console where to look for them. You can add additional paths in the settings under `library.playlist_paths`.

By default they are stored in the configuration directory under `./playlists`.

##### Filename

A playlist file must always end with the `.plist` extension to be recognized by Music Console. The filename can by anything, there are no restrictions. Just note that all whitespaces are transformed into a regular space on the prompt, so you should only use regular spaces in filenames.

##### File header

The first line of a playlist must be always `MUSICCONSOLE PLAYLIST` or Music Console will reject the file.

##### Empty lines and comments

Empty lines or lines starting with a hash sign (`#`) are always ignored. Everything after the hash sign in any other line will be ignored too. It can be used to add comments to your playlist file.

#### Getting Started

Creating a playlist is simple. An entry looks as follows:
```
T:"search term or file" player
T:'search term of file' player
```

`T` *(type)* is the format or filter which should be used. There are 6 different types to select from.

× `A` filters by songs </br>
× `V` filters by videos </br>
× `M` filters by module tracker files </br>
× `N` doesn't filter by format </br>
× `R` random </br>
× `F` specify a file (can be outside of the library too)

After the type follows a colon followed by a *search term* or a *filename*. The `player` at the end is optimal and is used to enforce a different player (player overrides). Leave it away to use the default player for the given type.

The *search term* or *filename* must be within double or single quotes. If you want to use a quote in the search term or if a filename has quotes in it, you need to prepend the quote character with a backslash (example: `\"`, `\'`).

**Pro tip!** </br>
There are 2 different quote characters you can choose from. If you use double quotes you can use single quotes normally inside the string, while double quotes must be prepended by a backslash. If you use single quotes you can use double quotes normally inside the string, while single quotes must be prepended by a backslash now.

Examples:
```
"this is an \"example\""
"this is an 'example'"
'this is an \'example\''
'this is an "example"'
```

</br>

#### Types

### `A`, `V`, `M`, `N`

This are the basic filters, which equals the commands `audio`, `video` and `module` on the prompt. `N` equals no command.

### `R` (random)

This type can be used to select random media files from the library to create dynamic playlists. To this type you need to append another type before you can specify a search term. Valid types for `R` are the 4 types mentioned above.

Leave the string empty to disable any additional filters.

Examples:
```
R:N:"filter term"
R:A:""
```

### `F` (file)

This type can be used to add songs or videos outside of the library to the playlist. You still use this for files which are in the library. Relative paths are always relative to the users home directory.

When not specifying a player override, the player will be determined using the file extension of the given file.

#### Default players

An overview of the default players used, when not specifying a player override.

```
│ A = audio             <──┐
│ V = video             <──┤
│ M = module            <──┤
│ N = audio             <──┤
│                          │
│ F = (auto-detect)        │
│                          │
│ R:[type] = [type]   >────┘
```

#### Starting a playlist

On the prompt: write down the `plistfile` command followed by the filename of the playlist without the `.plist` extension. This will search all configured directories for the given name. If no playlist was found or if the playlist contains syntax errors or is invalid, the app will tell you. It will even show you the faulty line which couldn't be understood so you can easily find and fix the problem.

#### Navigation

Navigating through a playlist is the same as navigating through a generated playlist or `shuffle`. Hit Enter to jump to the next entry in the playlist or hit enter twice in a row to stop the playlist and return to the prompt.

#### Example

For an example playlist covering all the possibilities see [**this**](./.github/example.plist) file.

What are you waiting for, now that you know all that create your awesome playlists  and enjoy your music and videos as never before :)

--

Need more help? If you didn't understood something or if something is still unclear you can join my community [Discord](https://discord.gg/4dpCQXv) server and ask for help in `#musicconsole`.
