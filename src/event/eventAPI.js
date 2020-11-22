const { MongoDataSource } = require("apollo-datasource-mongodb");
const { uploadFile } = require("@utils");

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

class EventAPI extends MongoDataSource {
    async getEvents() {
        return this.model.find({}).exec();
    }

    async getEventById(eventId) {
        return this.model.findById(eventId).exec();
    }

    async getEventsByIds(eventsIds) {
        return this.model.find({ _id: { $in: eventsIds } }).exec();
    }

    async getEventsByCreator(createdBy) {
        return this.model.find({ ...(createdBy && { createdBy: createdBy }) }).exec();
    }

    async getEventsByParam(args) {
        return this.model
            .find({
                ...(args.category && { category: args.category }),
                ...(args.type && { type: args.type }),
                ...(args.languages && { languages: { $in: args.languages } }),
                ...(args.tags && { tags: { $in: args.tags } }),
                ...(args.date && { startDate: new Date(args.date) }),
                ...(args.name && { name: args.name }),
            })
            .skip(args.offset)
            .limit(args.limit)
            .exec();
    }

    async createEvent(event) {
        const { imageFile, ...eventData } = event;
        const { createReadStream, filename, mimetype } = await imageFile;
        const { Location } = await uploadFile(createReadStream, filename, mimetype);
        if (this.context.userId) {
            eventData.createdBy = this.context.userId;
        }
        eventData.image = Location;
        console.log("Creating event: ", eventData);
        createAlgoliaEvent(eventData);
        return await this.model.create(eventData);
    }

    async modifyEvent(eventId, modifiedEvent) {
        const { ...modifiedEventData } = modifiedEvent;

        if (modifiedEvent.imageFile) {
            const { createReadStream, filename, mimetype } = await modifiedEvent.imageFile;
            const { Location } = await uploadFile(createReadStream, filename, mimetype);
            modifiedEventData.image = Location;
        }

        console.log(`Modifying event ${eventId}: `, modifiedEventData);
        return this.model
            .findOneAndUpdate(
                { _id: eventId, createdBy: this.context.userId },
                { $set: modifiedEventData },
                { new: true },
            )
            .exec();
    }

    async linkNftTemplatesToEvent(eventId, templateIds) {
        return this.model
            .findOneAndUpdate({ _id: eventId }, { $push: { nftTemplates: templateIds } }, { new: true })
            .exec();
    }
}

module.exports = { EventAPI };
