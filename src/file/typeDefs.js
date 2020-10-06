const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type File {
    uri: String!
    filename: String!
    mimetype: String!
    encoding: String!
    }

    extend type Mutation {
    uploadFile(file: Upload!): File
    }
`;

module.exports = {
    typeDefs
};