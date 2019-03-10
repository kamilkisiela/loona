const config = require('../../jest.config');

module.exports = {
  ...config,
  setupFiles: ['<rootDir>/tests/_setup.ts'],
};
