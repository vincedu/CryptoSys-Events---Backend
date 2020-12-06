const algoliasearch = require("algoliasearch");
const index = algoliasearch(process.env.ALGOLIASEARCH_APPLICATION_ID, process.env.ALGOLIASEARCH_API_KEY).initIndex(
    "events",
);
const fetch = require("node-fetch");

const formatEvent = async (event) => {
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
    if (event.location.type === "venue") {
        newEvent.location = event.location.location;
        // Fetch locations longitude and latitude
        const location = encodeURI(event.location.location);
        await fetch(
            "https://maps.googleapis.com/maps/api/geocode/json?address="
                .concat(location)
                .concat("&key=AIzaSyDZHQdnlyuo3spiKtfixH818xkohVXExh8"),
        )
            .then((response) => response.json())
            .then((data) => {
                newEvent._geoloc = {
                    lat: data.results[0].geometry.location.lat,
                    lng: data.results[0].geometry.location.lng,
                };
            })
            .catch();
    }
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

    await createAlgoliaEvents(events.map(async (event) => [await formatEvent(event)]));
};

module.exports = {
    formatEvent,
    mongoToAlgolia,
    createAlgoliaEvents,
};
