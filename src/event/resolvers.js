const { formatEvent, createAlgoliaEvents } = require("@utils");

const resolvers = {
    Query: {
        events: async (_, __, { dataSources }) => dataSources.eventAPI.getEvents(),
        distinct: async (_, args, { dataSources }) => dataSources.eventAPI.getDistinct(args.attribute),
        eventById: async (_, args, { dataSources }) => dataSources.eventAPI.getEventById(args.id),
        eventsByParam: async (_, args, { dataSources }) => dataSources.eventAPI.getEventsByParam(args),
        eventsByCreator: async (_, { dataSources }) =>
            dataSources.eventAPI.getEventsByCreator(dataSources.eventAPI.context.userId),
        eventsByIds: async (_, args, { dataSources }) => dataSources.eventAPI.getEventsByIds(args.ids),
    },
    Mutation: {
        createEvent: async (_, args, { dataSources }) =>
            await dataSources.eventAPI.createEvent(args.event).then((eventCreated) => {
                createAlgoliaEvents([formatEvent(eventCreated)]);
                return eventCreated;
            }),
        modifyEvent: async (_, args, { dataSources }) =>
            await dataSources.eventAPI.modifyEvent(args.eventId, args.event).then((modifiedEvent) => {
                createAlgoliaEvents([formatEvent(modifiedEvent)]);
                return modifiedEvent;
            }),
        linkNftTemplatesToEvent: async (_, { eventId, templateIds }, { dataSources }) =>
            dataSources.eventAPI.linkNftTemplatesToEvent(eventId, templateIds),
    },
};

module.exports = {
    resolvers,
};
