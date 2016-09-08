# Music Console

A simple console app which organizes all of your media files for fast and easy access.

#### What is it?

**Music Console** is a console application which scans your filesystem for media files and stores a list in memory. You can search this list using a simple search term, the first match is opened in a player of your choice.</br>
*Sounds kinda boring?* Don't worry! Music Console has so much features to offer which makes it unique.

</br>

**NOTE THE DEV NOTICE BELOW**

</br>

## Requirements

 - OS: anything, but Windows (except you install Cygwin, or something similar)
</br></br>
 - [NodeJS](https://www.nodejs.org) 6.5+ and `npm`
 - [node-gyp](https://github.com/nodejs/node-gyp): to build the native addons </br>
   Install with `npm install -g node-gyp` (if it not comes bundled with `npm` already)
 - GNU/[Readline](http://ftp.gnu.org/gnu/readline/) 6.3+

**NOTE:** I'm not using Node's readline library, because I'm relatively new to Node and JavaScript and I can't get it to work like GNU/Readline does it.

#### Building

 - Run `npm install` to install and build all dependencies. </br>
   If this command doesn't build the native C++ addons for some reason, run `node-gyp configure build`.

#### Running

 - Just issue `node .` to execute the application.

I will create a proper install and run script in the future.

</br></br></br>

## ~ Dev Notice ~

This project is a continuation of my old [Music Console](https://github.com/GhettoGirl/MusicConsole) written in C++11 and Qt5. I'm in the progess of learning NodeJS and Electron for any of my apps I will write in the future. C++ for GUI development got too lazy for me and it takes way too long. I need something future proof and Node/Electron got really popular these days.

For learning purposes and to gain experience in JavaScript, I decided to rewrite one of my favorite tools in Node. :grinning:

At the moment there isn't anything interesting in here. If you are interested in this app, head over to the old C++ version and use that.
