module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/tests/**/*.+(spec.ts)'],
  moduleFileExtensions: ['ts', 'js']
};
