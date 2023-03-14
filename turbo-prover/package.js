const package = require('./package.json');
const { writeFileSync, copyFileSync } = require('fs-extra');

const { jest, scripts, devDependencies, ...pkg } = package;
writeFileSync('./dest/package.json', JSON.stringify(pkg, null, '  '));
copyFileSync('README.md', './dest/README.md');
