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

const createAlgoliaEvents = (eventsArray) => {
    const algoliasearch = require("algoliasearch");
    const index = algoliasearch("VCNEJZ733V", "34110b7a7dda814d41a2851e341a2f6b").initIndex("events");

    return new Promise((resolve, reject) => {
        index
            .saveObjects(eventsArray)
            .then(({ objectIDs }) => {
                console.log(objectIDs);
                resolve(objectIDs);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const mongoToAlgolia = async () => {
    let resolvers = require("./event").resolvers;

    const events = await resolvers.Query.events().then((resolve) => {
        const algoliaEvents = resolve.map((event) => {
            formatEvent(event);
        });
        return algoliaEvents;
    });

    createAlgoliaEvents(events);
};

module.exports = {
    formatEvent,
    mongoToAlgolia,
    createAlgoliaEvents,
};
