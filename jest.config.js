module.exports = {
    testMatch: ["**/src/**/*.spec.ts"],
    testEnvironment: "node",
    transform: {
        "^.+\\.ts$": "ts-jest"
    }
};