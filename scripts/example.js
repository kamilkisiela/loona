const {exec} = require('shelljs');
const {resolve, join, basename} = require('path');
const {readdirSync, lstatSync} = require('fs');
const Tasks = require('listr');

const [, , CMD, EXAMPLE] = process.argv;

const actions = {
  angular: {
    run: name => runAngular(name),
    build: name => buildAnguar(name),
  },
  react: {
    run: name => runReact(name),
    build: name => buildReact(name),
  },
};

if (!['run', 'build', 'build-all'].includes(CMD)) {
  console.error('Use either run, build or build-all');
  process.exit(1);
}

if (CMD === 'build-all' && EXAMPLE) {
  console.error('Do not use name with build-all');
  process.exit(1);
}

if (CMD !== 'build-all' && !EXAMPLE) {
  console.error('Specify name of an example');
  process.exit(1);
}

if (CMD === 'build-all') {
  buildAll()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
} else {
  const [framework, name] = EXAMPLE.split(':');

  single(CMD, framework, name)
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

function single(cmd, framework, name) {
  const api = actions[framework];

  if (!api) {
    throw new Error(`There is no example for ${framework}`);
  }

  if (cmd === 'build') {
    return api.build(name);
  } else {
    return api.run(name);
  }
}

function buildAll() {
  const EXAMPLES_DIR = resolve(__dirname, '../examples');
  const frameworks = readDirs(EXAMPLES_DIR).map(p => basename(p, ''));
  const examples = [];

  frameworks.forEach(framework => {
    readDirs(resolve(EXAMPLES_DIR, framework))
      .map(p => basename(p, ''))
      .forEach(name => examples.push([framework, name]));
  });

  const tasks = new Tasks(
    examples.map(([framework, name]) => {
      return {
        title: `Building ${framework}:${name}`,
        task: () => single('build', framework, name),
      };
    }),
    {
      concurrent: true,
    },
  );

  return tasks.run();
}

function runAngular(name) {
  return command(`ng run ${name}:serve`);
}
function buildAnguar(name) {
  return command(`ng run ${name}:build:production`, true);
}
function runReact(name) {
  return command(`(cd examples/react/${name} && yarn start)`);
}
function buildReact(name) {
  return command(`(cd examples/react/${name} && yarn build)`, true);
}

function command(cmd, silent = false) {
  return new Promise((resolve, reject) => {
    exec(cmd, {async: true, silent}, (code, stdout, stderr) => {
      if (code === 1) {
        console.log(stderr || stdout);
        reject(stderr || stdout);
      } else {
        resolve(stdout);
      }
    });
  });
}

// utils

function readDirs(dirpath) {
  return readdirSync(dirpath)
    .map(source => join(dirpath, source))
    .filter(source => lstatSync(source).isDirectory());
}
