module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  "coveragePathIgnorePatterns": [
    "/node_modules/"
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.redis-mock.js', '<rootDir>/src/tests/setEnvVars.js'],
};