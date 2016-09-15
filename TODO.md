# Todo list

 - [x] ~~Implement native GNU/Readline addon~~ **REMOVED AND REPLACED BY NODE MODULE**
 - [ ] Implement native MediaLibraryModel addon </br>
       <sub>For the sake of memory usage and performance I will **NOT** use JavaScript for this.</sub>
      - [x] FileSystemModel </br>
      - [ ] MediaFile </br>
      - [ ] MediaCache </br>
      - [ ] TagReader </br>
 - [x] Implement command prompt
 - [ ] Implement unicode tools
 - [ ] Improve the command prompt with the unicode tools
 - [x] Implement history manager
 - [ ] Find out how I can do this in Node -> **kbhit** [cpp](https://github.com/GhettoGirl/MusicConsole/blob/master/Sys/kbhit.cpp), [hpp](https://github.com/GhettoGirl/MusicConsole/blob/master/Sys/kbhit.hpp) </br>
       This is very important and I need this for this project!!
 - [ ] Implement a user settings manager
 - [ ] Implement a media player controller
 - [ ] Implement a playlist parser (for my custom playlist format, see README of old Music Console for syntax)
 - [ ] Implement a path expander (if there is not a node module for this already)
 - [ ] Port the *SearchKeys* class from the C++ version to Node
 - [ ] Implement a search path generator (comprehensive universal unicode/intl lookup)
 - [ ] Port all the search path gens to Node (maybe use C++ addons for assistence)
 - [ ] Implement all the commands `:^)`

</br>

 - [ ] Write "installer" which minifies the code to a bare minimum to reduce the size of release builds </br>
       There is no point in hundreds of empty lines and code comment when you are never see the code anyway. </br>
       As an extend this can also improve the performance a little bit.

