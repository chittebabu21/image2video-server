module.exports = {
    testMatch: ['**/test/**/*.spec.ts'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest'
    }
};