#!/usr/bin/env node

const standardpaths = require('./index.js');

console.log("--- resolved paths ---");
console.log("HomePath:             " + standardpaths.path(standardpaths.HomePath));
console.log("ConfigLocation:       " + standardpaths.path(standardpaths.ConfigLocation));
console.log("SystemConfigLocation: " + standardpaths.path(standardpaths.SystemConfigLocation));

console.log();

console.log("--- environment variables ---");
console.log("HomePath:             " + standardpaths.path(standardpaths.HomePath, false));
console.log("ConfigLocation:       " + standardpaths.path(standardpaths.ConfigLocation, false));
console.log("SystemConfigLocation: " + standardpaths.path(standardpaths.SystemConfigLocation, false));
