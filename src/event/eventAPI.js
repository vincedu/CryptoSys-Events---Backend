const { MongoDataSource } = require("apollo-datasource-mongodb");
const { uploadFile } = require("@utils");

class EventAPI extends MongoDataSource {
    async getEvents() {
        return this.model.find({}).exec();
    }

    async getEventById(eventId) {
        return this.model.findById(eventId).exec();
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
        return await this.model.create(eventData);
    }

    async linkNftTemplatesToEvent(eventId, templateIds) {
        return this.model
            .findOneAndUpdate({ _id: eventId }, { $set: { nftTemplates: templateIds } }, { new: true })
            .exec();
    }
}

module.exports = { EventAPI };
