const { makeExecutableSchema } = require("graphql-tools");
const { mergeResolvers } = require("@graphql-tools/merge");
const { GraphQLDateTime } = require("graphql-iso-date");
const event = require("./event");

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

const schema = makeExecutableSchema({
    typeDefs: [typeDefs, event.typeDefs],
    resolvers: mergeResolvers([resolvers, event.resolvers]),
});

module.exports = {
    schema
}
