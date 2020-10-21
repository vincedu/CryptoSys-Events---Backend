const { mergeResolvers } = require("@graphql-tools/merge");
const { GraphQLDateTime } = require("graphql-iso-date");
const event = require("./event");
const ticket = require("./ticket");

const typeDefs = `
    type Query
    type Mutation
    scalar DateTime
`;

const resolvers = {
    Query: {},
    Mutation: {},
    DateTime: GraphQLDateTime,
};

const schema = {
    typeDefs: [typeDefs, event.typeDefs, ticket.typeDefs],
    resolvers: mergeResolvers([resolvers, event.resolvers, ticket.resolvers]),
};

module.exports = {
    schema,
};
