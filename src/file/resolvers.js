const { uploadFile } = require("./fileUpload");

const resolvers = {
    Mutation: {
        uploadFile: async (_, { file }) => {
            const { createReadStream, filename, mimetype, encoding } = await file;

            const { Location } = await uploadFile(createReadStream, filename, mimetype);

            return {
                filename,
                mimetype,
                encoding,
                uri: Location,
            };
        },
    },
}

module.exports = {
    resolvers
};