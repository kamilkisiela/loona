const globals = {
  react: 'React',
  'react-apollo': 'react-apollo',
  'apollo-client': 'apollo',
  '@loona/core': 'loona.core',
  'prop-types': 'PropTypes'
};

export default {
  input: 'build/index.js',
  external: Object.keys(globals),
  output: {
    file: 'build/loona.react.umd.js',
    format: 'umd',
    name: 'loona.react',
    exports: 'named',
    sourcemap: true,
    globals,
  },
  onwarn,
};

function onwarn(message) {
  const suppressed = ['THIS_IS_UNDEFINED'];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}
