// front-end/jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',  // Your setup file for global mocks
    '<rootDir>/components/tests/setupTests.ts' // Your additional setup for component-specific tests
  ],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    "**/tests/**/*.test.[jt]s?(x)", // only files in tests folders
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  }
};

module.exports = createJestConfig(customJestConfig);
