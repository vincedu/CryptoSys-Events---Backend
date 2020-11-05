const { mergeResolvers } = require("@graphql-tools/merge");
const { GraphQLDateTime } = require("graphql-iso-date");
const event = require("./event");
const ticket = require("./ticket");
const { getUserId } = require("./auth/user");

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
    context: async ({ req }) => {
        try {
            const userId = await getUserId(req);

            // add the user to the context
            return { userId };
        } catch (error) {
            return {};
        }
    },
    dataSources: () => ({
        eventAPI: new event.EventAPI(event.EventModel),
        atomicAssetsAPI: new ticket.AtomicAssetsAPI(),
    }),
};

module.exports = {
    schema,
};
