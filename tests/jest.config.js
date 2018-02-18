module.exports = {
  rootDir: '../',
  transform: {
    '.ts': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  },
  mapCoverage: true,
  testRegex: '/lib/.*\\.spec\\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts']
};
