# Todo list

 - [x] ~~Implement native GNU/Readline addon~~ **REMOVED AND REPLACED BY NODE MODULE** </br>
       **REPLACE BY ANOTHER NODE MODULE OR GO BACK TO GNU/READLINE!!** </br>
       Noticed the prompt I'm using has no proper Unicode support. The spacing gets fucked up when typing wide characters like widelatin, Japanese, Chinese, Korean, etc. </br>
       I need a modern Unicode and wide character friendly prompt (like GNU/Readline) </br>
       Wide characters usually take up 2 (or in rare cases even more than 3) columns in the terminal </br>
       Maybe start another attempt to integrate GNU/Readline and try to handle SIGINT
      - [ ] Replace 'prompt-sync' with better prompt which has proper has wide-char support
 - [ ] Implement ~~native~~ MediaLibraryModel ~~addon~~ (in JavaScript) </br>
       <sub>First I wanted to Implement this in C++, but it got to tricky...</sub>
      - [x] ~~FileSystemModel ─ recursive file system scanner~~ **REPLACED BY NODE MODULE**
      - [x] MediaFile ─ to store data, like tags etc.
      - [x] MediaCache ─ to cache tags for fast loading
      - [x] TagReader ─ read tags using taglib
      - [ ] Search functionality
      - [ ] Optimizations and bug fixing
 - [ ] Replace 'binary-serialize' (C++ addon) with 'node-pack', because its serialized content is way smaller than cerials
 - [x] Implement command prompt
 - [ ] Implement string simplifier for user input </br>
       Trim unnecessary whitespaces, etc.
      - [ ] Extend the command prompt with it
 - [x] Implement history manager
 - [ ] Find out how I can do this in Node -> **kbhit** [cpp](https://github.com/GhettoGirl/MusicConsole/blob/master/Sys/kbhit.cpp), [hpp](https://github.com/GhettoGirl/MusicConsole/blob/master/Sys/kbhit.hpp) </br>
       This is very important and I need this for this project!!
 - [x] Implement a user settings manager
 - [ ] Implement a media player controller
 - [ ] Implement a playlist parser (for my custom playlist format, see README of old Music Console for syntax)
 - [ ] Implement a path expander (if there is not a node module for this already) </br>
       Send only absolute paths to players
 - [ ] Port the *SearchKeys* class from the C++ version to Node
 - [x] Implement search term generators (comprehensive universal unicode/intl lookup)
      - [x] Basic Implementation
      - [x] Latin-1/WideLatin
      - [x] Japanese Kana
           - [x] Enhanced DAKUTEN(濁点) support
      - [x] Whitespace Fixer
 - [ ] Implement all the commands `:^)` </br>
       <sub>For a detailed description of all the commands see the README of the old Music Console.</sub>
      - [ ] The 'command-less' command, alias 'hidden audio command'
      - [ ] Media filter commands, *audio*, *video*, *module*
      - [ ] *random*
      - [ ] *shuffle*
      - [ ] *repeat*
      - [ ] *search*
      - [ ] *browse*
      - [ ] *history* (print history to screen)
      - [ ] *statistics*
      - [ ] *playlist*
      - [ ] *rescan* (to rescan the filesystem without restarting the app)
      - [ ] *exit*

</br>

 - [ ] Write "installer" which minifies the code to a bare minimum to reduce the size of release builds </br>
       There is no point in hundreds of empty lines and code comments when you are never see the code anyway. </br>
       As an extend this can also improve the performance a little bit.

