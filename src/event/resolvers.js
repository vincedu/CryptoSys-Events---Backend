const { Event } = require("./model");
const { uploadFile } = require("@utils");

const resolvers = {
    Query: {
        events: async () => await Event.find({}).exec(),
        eventById: async (_, args) => await Event.findById(args.id).exec(),
    },
    Mutation: {
        createEvent: async (_, args) => {
            const { imageFile, ...eventData } = args.event;
            const { createReadStream, filename, mimetype } = await imageFile;
            const { Location } = await uploadFile(createReadStream, filename, mimetype);
            eventData.image = Location;
            console.log("Creating event: ", eventData)
            return await Event.create(eventData);
        },
    },
};

module.exports = {
    resolvers,
};