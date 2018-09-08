const {resolve, join} = require('path');
const {lstatSync, readdirSync, readFileSync, writeFileSync} = require('fs');
const {valid} = require('semver');

const VERSION = process.argv[2];
const PACKAGES_DIR = resolve(__dirname, '../packages');
const EXAMPLES_DIR = resolve(__dirname, '../examples/react');

if (!VERSION) {
  console.error('No version!');
  process.exit(1);
}

console.log('> Picked version:', VERSION);

if (!valid(VERSION)) {
  console.error('Picked version is not valid!');
  process.exit(1);
}

// absolute/path/to/loona/packages/<dir>
const packageDirs = readDirs(PACKAGES_DIR);

// absolute/path/to/loona/examples/react/<dir>
const exampleDirs = readDirs(EXAMPLES_DIR);

const packages = packageDirs.map(dir => {
  return JSON.parse(readPackageJson(dir)).name;
});

const findPackages = new RegExp(
  `"(${packages.join('|')})":[\ ]+"([^"]+)"`,
  'g',
);

console.log('> Updating packages...');
packageDirs.forEach(dir => {
  updatePackageJson(dir);
});

console.log('> Updating examples...');
exampleDirs.forEach(dir => {
  updatePackageJson(dir);
});

console.log('> Done. Version updated!');
process.exit(0);

function readPackageJson(dir) {
  return readFileSync(join(dir, 'package.json'), {encoding: 'utf-8'});
}

function updatePackageJson(dir) {
  const package = readPackageJson(dir)
    .replace(/"version":\s+"([^"]+)"/, `"version": "${VERSION}"`)
    .replace(findPackages, `"$1": "${VERSION}"`);

  writeFileSync(join(dir, 'package.json'), package, {encoding: 'utf-8'});
}

function readDirs(dirpath) {
  return readdirSync(dirpath)
    .map(source => join(dirpath, source))
    .filter(source => lstatSync(source).isDirectory());
}
