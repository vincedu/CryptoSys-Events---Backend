module.exports = {
    mongodbMemoryServerOptions: {
        instance: {
            dbName: "jest",
        },
        binary: {
            version: "3.6.5", // Version of MongoDB
            skipMD5: true,
        },
        autoStart: false,
    },
};
