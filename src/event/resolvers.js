const createAlgoliaEvent = (event) => {
    const algoliasearch = require("algoliasearch");
    const index = algoliasearch("VCNEJZ733V", "34110b7a7dda814d41a2851e341a2f6b").initIndex("events");

    const newEvent = {};
    newEvent.name = event.name;
    newEvent.description = event.description;
    newEvent.tags = event.tags;
    newEvent.category = event.category;
    newEvent.type = event.type;
    newEvent.image = event.image;
    newEvent.objectID = event._id;
    newEvent.date = +event.startDate;
    newEvent.languages = event.languages;

    index
        .saveObjects([newEvent])
        .then(({ objectIDs }) => {
            console.log("Added to Algolia");
            console.log(objectIDs);
        })
        .catch((err) => {
            console.log(err);
        });
};

const resolvers = {
    Query: {
        events: async (_, __, { dataSources }) => dataSources.eventAPI.getEvents(),
        eventById: async (_, args, { dataSources }) => dataSources.eventAPI.getEventById(args.id),
        eventsByParam: async (_, args, { dataSources }) => dataSources.eventAPI.getEventsByParam(args),
        eventsByCreator: async (_, { dataSources }) =>
            dataSources.eventAPI.getEventsByCreator(dataSources.eventAPI.context.userId),
        eventsByIds: async (_, args, { dataSources }) => dataSources.eventAPI.getEventsByIds(args.ids),
    },
    Mutation: {
        createEvent: async (_, args, { dataSources }) =>
            dataSources.eventAPI.createEvent(args.event).then((eventCreated) => {
                createAlgoliaEvent(eventCreated);
                return eventCreated;
            }),
        modifyEvent: async (_, args, { dataSources }) => dataSources.eventAPI.modifyEvent(args.eventId, args.event),
        linkNftTemplatesToEvent: async (_, { eventId, templateIds }, { dataSources }) =>
            dataSources.eventAPI.linkNftTemplatesToEvent(eventId, templateIds),
    },
};

module.exports = {
    resolvers,
};
