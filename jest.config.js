module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/examples/',
    'dist/',
    '(.test)\\.(ts|tsx|js)$',
    'jest.transform.js',
    '.json',
  ],
  moduleNameMapper: {
    '^@hyperion-framework/vault/lib/(.*)$': '<rootDir>/packages/vault/src/$1',
    '^@hyperion-framework/(.*)$': '<rootDir>/packages/$1/src',
  },
};
