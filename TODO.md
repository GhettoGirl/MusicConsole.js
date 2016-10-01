# Todo list

 - [ ] Windows support </br>
       I hardcoded a lot of UNIX-style paths, this was bad. Now I need to change some things to make them cross-platform.
      - [ ] Use **WinEditline** on Windows, redistribute in binary form and link statically
      - [ ] Make all paths cross-platform compatible -> `/` becomes `path.join()` everywhere, except for `require()`
      - [x] Write environment variable resolver for Windows to support %ENV% style variables
      - [x] Improve `node-standardpaths` to give more accurate results on Windows
 - [x] Improve the prompt
      - [x] Change display appearance using escape sequences
      - [x] Improve signal handling, there are some scenarios which can cause a SEGFAULT in Node itself </br>
            Shit's fixed now, finally!!!
 - [ ] **[Maybe?]** GNU/Readline: implement custom auto-completer for the media library
 - [ ] Improve the user settings manager
      - [ ] Simplify validation
      - [ ] Make every single config changeable from the command line
           - [x] Library path
           - [ ] Playlist paths
           - [x] Commands
           - [ ] Prefix Deletion Patterns
           - [ ] Name filters
           - [ ] Players and Tools
           - [ ] Appearance Preferences
           - [ ] Prompt Preferences
           - [ ] Randomizer Settings
 - [ ] Implement *new* search term generators (comprehensive universal unicode/intl lookup)
      - [ ] for the Cyrillic writing system
      - [ ] ...?
 - [ ] Implement favorites feature
 - [ ] Do something nice with genres
      - [ ] `shuffle`
      - [ ] ???

--

I'm still learning JavaScript, because you can't learn a programming language in several days. But I know more than I did several days ago ─ its time to improve some things and clean up the code.

 - [ ] Simplify `undefined` checks, don't use `typeof` everywhere when its not necessary.
 - [ ] Improve all data type checks to check the actual type like `Array` etc.
     - [x] ~~Research if you can get the name of custom objects in JavaScript~~ </br>
           If so then probably check for `MediaFile` in the `MediaPlayerController` </br>
           `instanceof` is now used here
     - [ ] **Or even better**, remove almost every data types check (not all of them), because this is not a library which will be published on npm, but a standalone application ─ it will not be used for development obviously. Data type checks are unnecessary slow-downers - when not that much, it improves the performance of my application a little bit.

 - [ ] ... find more things which need improvements on the JavaScript-side, not App-based improvements
