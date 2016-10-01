#!/usr/bin/env node

const standardpaths = require('./index.js');

console.log("HomePath:             " + standardpaths.path(standardpaths.HomePath));
console.log("ConfigLocation:       " + standardpaths.path(standardpaths.ConfigLocation));
console.log("SystemConfigLocation: " + standardpaths.path(standardpaths.SystemConfigLocation));
