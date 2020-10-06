const { Event } = require("./model");

const resolvers = {
    Query: {
        events: async () => await Event.find({}).exec(),
        eventById: async (_, args) => await Event.findById(args.id).exec(),
    },
    Mutation: {
        createEvent: async (_, args) => await Event.create(args.event),
    },
};

module.exports = {
    resolvers,
};