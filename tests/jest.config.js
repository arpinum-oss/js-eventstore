module.exports = {
  rootDir: '../',
  transform: {
    '.ts': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  },
  testRegex: '/lib/.*\\.spec\\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts']
};
