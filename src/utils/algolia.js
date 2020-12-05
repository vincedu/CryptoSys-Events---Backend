const algoliasearch = require("algoliasearch");
const index = algoliasearch(process.env.ALGOLIASEARCH_APPLICATION_ID, process.env.ALGOLIASEARCH_API_KEY).initIndex(
    "events",
);

const formatEvent = (event) => {
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

    return newEvent;
};

const createAlgoliaEvents = async (eventsArray) => {
    index
        .saveObjects(eventsArray)
        .then(({ objectIDs }) => {
            console.log(objectIDs);
        })
        .catch((err) => {
            console.log(err);
        });
};

const mongoToAlgolia = async () => {
    const resolvers = require("../event").resolvers;
    const { EventAPI } = require("../event");
    const { EventModel } = require("../event");

    const dataSources = { eventAPI: new EventAPI(EventModel) };

    const events = await resolvers.Query.events(null, null, { dataSources }).catch((err) => console.log(err));

    await createAlgoliaEvents(events.map((event) => formatEvent(event)));
};

module.exports = {
    formatEvent,
    mongoToAlgolia,
    createAlgoliaEvents,
};
