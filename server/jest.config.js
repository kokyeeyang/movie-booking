module.exports = {
    testEnvironment: 'node', // Required for backend testing
    setupFiles: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/tests/**/*.test.js'], // Looks for test files in tests/ folder
    verbose: true, // Shows detailed test results in terminal
};