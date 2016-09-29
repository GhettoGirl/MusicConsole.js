# Todo list

 - [ ] Improve the prompt
      - [ ] Change display appearance using escape sequences
      - [ ] Improve signal handling, there are some scenarios which can cause a SEGFAULT in Node itself
 - [ ] **[Maybe?]** GNU/Readline: implement custom auto-completer for the media library
 - [ ] Improve the user settings manager
      - [ ] Simplify validation
      - [ ] Make every single config changeable from the command line
 - [ ] Implement *new* search term generators (comprehensive universal unicode/intl lookup)
      - [ ] for the Cyrillic writing system
      - [ ] ...?
 - [ ] Implement favorites feature
 - [ ] Do something nice with genres (not sure at the moment)

--

I'm still learning JavaScript, because you can't learn a programming language in several days. But I know more than I did several days ago ─ its time to improve some things and clean up the code.

 - [ ] Simplify `undefined` checks, don't use `typeof` everywhere when its not necessary.
 - [ ] Improve all data type checks to check the actual type like `Array` etc.
     - [ ] Research if you can get the name of custom objects in JavaScript </br>
           If so then probably check for `MediaFile` in the `MediaPlayerController`
     - [ ] **Or even better**, remove almost every data types check (not all of them), because this is not a library which will be published on npm, but a standalone application ─ it will not be used for development obviously. Data type checks are unnecessary slow-downers - when not that much, it improves the performance of my application a little bit.

 - [ ] ... find more things which need improvements on the JavaScript-side, not App-based improvements
