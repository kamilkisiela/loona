export const bundleName = name => `luna.${name}`;

export const globals = {
  // Luna
  '@luna/core': bundleName('core'),
  '@luna/angular': bundleName('angular'),
  // Angular
  '@angular/core': 'ng.core',
  // Apollo
  'apollo-angular': 'apollo.core',
  'apollo-link': 'apolloLink.core',
  'apollo-link-state': 'apolloLink.state',
  'apollo-client': 'apollo',
  // RxJS
  rxjs: 'rxjs',
  'rxjs/operators': 'rxjs.operators',
};

export default name => ({
  input: 'build/index.js',
  output: {
    file: 'build/bundle.umd.js',
    format: 'umd',
    exports: 'named',
    name: bundleName('name'),
    sourcemap: true,
    globals,
  },
  external: Object.keys(globals),
  onwarn,
});

export function onwarn(message) {
  const suppressed = [/*'UNRESOLVED_IMPORT',*/ 'THIS_IS_UNDEFINED'];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}
