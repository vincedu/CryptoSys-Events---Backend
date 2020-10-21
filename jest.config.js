module.exports = {
    preset: "@shelf/jest-mongodb",
    moduleNameMapper: {
        "^@config/(.*)$": "<rootDir>/src/config/$1",
        "^@db/(.*)$": "<rootDir>/src/db/$1",
        "^@utils$": "<rootDir>/src/utils",
        "^@ipfs$": "<rootDir>/src/ipfs",
    },
};
