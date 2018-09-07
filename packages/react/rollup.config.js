import {uglify} from 'rollup-plugin-uglify';

const globals = {
  react: 'React',
  'react-apollo': 'react-apollo',
  'apollo-client': 'apollo',
  '@loona/core': 'loona.core',
  'prop-types': 'PropTypes',
};

const file = 'build/loona.react.umd.js';

const config = {
  input: 'build/index.js',
  external: Object.keys(globals),
  output: {
    file,
    format: 'umd',
    name: 'loona.react',
    exports: 'named',
    sourcemap: true,
    globals,
  },
  onwarn,
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: file.replace('.js', '.min.js'),
    },
    plugins: [uglify()],
  },
];

function onwarn(message) {
  const suppressed = ['THIS_IS_UNDEFINED'];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}
