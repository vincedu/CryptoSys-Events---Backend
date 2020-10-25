const { Event } = require("./model");
const { uploadFile } = require("@utils");

const resolvers = {
    Query: {
        events: async () => await Event.find({}).exec(),
        eventById: async (_, args) => await Event.findById(args.id).exec(),
        eventsByParam: async (_, args) =>
            await Event.find({
                ...(args.category && { category: args.category }),
                ...(args.type && { type: args.type }),
                ...(args.languages && { languages: { $in: args.languages } }),
                ...(args.tags && { tags: { $in: args.tags } }),
                ...(args.date && { startDate: new Date(args.date) }),
                ...(args.name && { name: args.name }),
            })
                .skip(args.offset)
                .limit(args.limit)
                .exec(),
    },
    Mutation: {
        createEvent: async (_, args) => {
            const { imageFile, ...eventData } = args.event;
            const { createReadStream, filename, mimetype } = await imageFile;
            const { Location } = await uploadFile(createReadStream, filename, mimetype);
            eventData.image = Location;
            console.log("Creating event: ", eventData);
            return await Event.create(eventData);
        },
    },
};

module.exports = {
    resolvers,
};
