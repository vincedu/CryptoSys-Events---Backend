const resolvers = {
    Query: {
        events: async (_, __, { dataSources }) => dataSources.eventAPI.getEvents(),
        eventById: async (_, args, { dataSources }) => dataSources.eventAPI.getEventById(args.id),
        eventsByParam: async (_, args, { dataSources }) => dataSources.eventAPI.getEventsByParam(args),
    },
    Mutation: {
        createEvent: async (_, args, { dataSources }) => dataSources.eventAPI.createEvent(args.event),
        linkNftToEvent: async (_, { eventId, collectionName, schemaName }, { dataSources }) =>
            dataSources.eventAPI.linkNftToEvent(eventId, collectionName, schemaName),
    },
};

module.exports = {
    resolvers,
};
