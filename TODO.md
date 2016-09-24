# Todo list

 - [x] Implement native GNU/Readline addon ~~**REMOVED AND REPLACED BY NODE MODULE**~~ </br>
       ~~**REPLACE BY ANOTHER NODE MODULE OR GO BACK TO GNU/READLINE!!**~~ </br>
       Noticed the prompt I'm using has no proper Unicode support. The spacing gets fucked up when typing wide characters like widelatin, Japanese, Chinese, Korean, etc. </br>
       I need a modern Unicode and wide character friendly prompt (like GNU/Readline) </br>
       Wide characters usually take up 2 (or in rare cases even more than 3) columns in the terminal </br>
       Maybe start another attempt to integrate GNU/Readline and try to handle SIGINT
      - [x] Replace 'prompt-sync' with better prompt which has proper wide-char support </br>
            *REPLACED WITH AN IMPROVED VERSION OF MY GNU/READLINE ADDON!*
 - [ ] **[Maybe?]** GNU/Readline: implement custom auto-completer for the media library
 - [x] Implement MediaLibraryModel
      - [x] ~~FileSystemModel ─ recursive file system scanner~~ **REPLACED BY NODE MODULE**
      - [x] MediaFile ─ to store data, like tags etc.
      - [x] MediaCache ─ to cache tags for fast loading
      - [x] TagReader ─ read tags using taglib
      - [x] Search functionality
      - [x] Implement everything which is still missing (from the C++ version)
      - [ ] Optimizations and bug fixing
 - [x] Replace 'binary-serialize' (C++ addon) with 'node-pack', because its serialized content is way smaller than cereal (can safe a lot of disk space)
 - [x] Implement command prompt
 - [x] Implement string simplifier for user input </br>
       Trim unnecessary whitespaces, etc.
      - [x] Extend the command prompt with it
 - [x] Implement history manager
 - [x] ~~Find out how I can do this in Node~~ -> **kbhit** [cpp](https://github.com/GhettoGirl/MusicConsole/blob/master/Sys/kbhit.cpp), [hpp](https://github.com/GhettoGirl/MusicConsole/blob/master/Sys/kbhit.hpp) </br>
       This is very important and I need this for this project!! </br>
       *I'm unable to find a way to do this in Node, so lets create another native addon for this...* </br>
       Feature implemented in a native addon, and it works like a charm :)
 - [x] Implement a user settings manager
 - [x] Implement a media player controller
 - [ ] Implement a playlist parser (for my custom playlist format, see README of old Music Console for syntax)
 - [x] ~~Implement a path expander (if there is not a node module for this already)~~ </br>
       Send only absolute paths to players `path.resolve()` ~~alternative paths are ok~~ <- they are **NOT**
 - [x] Port the *SearchKeys* class from the C++ version to Node </br>
       Don't change anything because it works great and it took me weeks to write this class.
 - [x] Implement search term generators (comprehensive universal unicode/intl lookup)
      - [x] Basic Implementation
      - [x] Latin-1/WideLatin
      - [x] Japanese Kana
           - [x] Enhanced DAKUTEN(濁点) support
      - [x] Whitespace Fixer
 - [x] Implement a solid and extendable command line parser
 - [ ] Implement all the commands `:^)` </br>
       <sub>For a detailed description of all the commands see the README of the old Music Console.</sub>
      - [ ] The 'command-less' command, alias 'hidden audio command'
      - [ ] Media filter commands, *audio*, *video*, *module*
      - [ ] *random*
      - [ ] *shuffle*
      - [ ] *repeat*
      - [ ] *search*
      - [ ] *browse*
      - [x] *history* (print history to screen)
      - [x] *statistics*
      - [ ] *playlist*
      - [x] *rescan* (to rescan the filesystem without restarting the app)
      - [x] *exit*
</br></br>
 - [x] Simplify `require` statements, get rid of relative paths </br>
       Every relative path was removed, except `./`
 - [x] `MediaFile.print()` allow custom appearance </br>
       Add new settings and allow the user to easily customize the display appearance of media files.
 - [x] Command line parser and options </br>
       To modify first start options, like the library path and other options in the future.
</br></br>
 - [ ] Make use of [check-types](https://www.npmjs.com/package/check-types) to simplify a lot of things and make my application robust against JavaScript's data type madness.

</br></br>

 - [x] Write "installer" which minifies the code to a bare minimum to reduce the size of release builds </br>
       There is no point in hundreds of empty lines and code comments when you are never see the code anyway. </br>
       As an extend this can also improve the performance.
 - [ ] Write **test suite**, run **BEFORE** AND **AFTER** the installation, to make sure the minifier doesn't fuck up anything.
