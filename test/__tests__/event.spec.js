const mongoose = require("mongoose");
const { Events } = require("../helpers/data");
const dependency = require("../../src/utils");

describe("Event resolver test", () => {
    const mockUrl = "mockUrl";
    let resolvers;
    let firstEvent;

    beforeAll(async () => {
        dependency.uploadFile = jest.fn(() => {
            return { Location: mockUrl };
        });
        resolvers = require("../../src/event/resolvers").resolvers;
        await mongoose.connect(
            global.__MONGO_URI__,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
            (err) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            },
        );
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should create an event successfully", async () => {
        const event = Events[0];
        const userId = "asdfqasdfqwfsad";
        firstEvent = await resolvers.Mutation.createEvent(null, { event }, { userId });
        expect(firstEvent._id).toBeDefined();
        expect(firstEvent.name).toEqual(event.name);
        expect(firstEvent.type).toEqual(event.type);
        expect(firstEvent.createdBy).toEqual(userId);
        expect(firstEvent.category).toEqual(event.category);
        expect(firstEvent.image).toEqual(mockUrl);
        expect(firstEvent.languages).toEqual(expect.arrayContaining(event.languages));
        expect(firstEvent.tags).toEqual(expect.arrayContaining(event.tags));
        expect(firstEvent.location).toMatchObject(event.location);
        expect(firstEvent.startDate).toEqual(event.startDate);
        expect(firstEvent.endDate).toEqual(event.endDate);
    });

    it("should create event with invalid field successfully, but the field not defined in schema should be undefined", async () => {
        const event = Events[1];
        const userId = "asdfqasdfqwfsad";
        const savedEvent = await resolvers.Mutation.createEvent(null, { event }, userId);
        expect(savedEvent._id).toBeDefined();
        expect(savedEvent.randomField).toBeUndefined();
    });

    it("should fail when required field is missing", async () => {
        const event = Events[2];
        const user = "asdfwafsdfqwefasdf";
        let err;
        try {
            await resolvers.Mutation.createEvent(null, { event }, { user });
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.description).toBeDefined();
    });

    it("should fail when image file is missing", async () => {
        const event = Events[3];
        let err;
        try {
            await resolvers.Mutation.createEvent(null, { event });
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
    });

    it("should fetch all events", async () => {
        const events = await resolvers.Query.events();
        expect(events.length).toBe(2);
    });

    it("should fetch an event by id", async () => {
        const requestedEvent = await resolvers.Query.eventById(null, { id: firstEvent._id });
        expect(requestedEvent._id).toEqual(firstEvent._id);
        expect(requestedEvent.name).toEqual(firstEvent.name);
        expect(requestedEvent.type).toEqual(firstEvent.type);
        expect(requestedEvent.category).toEqual(firstEvent.category);
        expect(requestedEvent.image).toEqual(mockUrl);
        expect(requestedEvent.languages).toEqual(expect.arrayContaining(firstEvent.languages));
        expect(requestedEvent.tags).toEqual(expect.arrayContaining(firstEvent.tags));
        expect(requestedEvent.location).toMatchObject(firstEvent.location);
        expect(requestedEvent.startDate).toEqual(firstEvent.startDate);
        expect(requestedEvent.endDate).toEqual(firstEvent.endDate);
    });
});
