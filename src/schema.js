const { mergeResolvers } = require("@graphql-tools/merge");
const { GraphQLDateTime } = require("graphql-iso-date");
const event = require("./event");
const file = require("./file");

const typeDefs = `
    type Query
    type Mutation
    scalar DateTime
`;

const resolvers = {
    Query: {},
    Mutation: {},
    DateTime: GraphQLDateTime
};

const schema = {
    typeDefs: [typeDefs, event.typeDefs, file.typeDefs],
    resolvers: mergeResolvers([resolvers, event.resolvers, file.resolvers]),
};

module.exports = {
    schema
}
