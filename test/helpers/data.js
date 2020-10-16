const Events = [
    // Complete request
    {
        name: "Event 1",
        description: "Description 1",
        type: "type 1",
        category: "category 1",
        imageFile: { createReadStream: "", filename: "", mimetype: "" },
        languages: ["fr", "en"],
        tags: ["yolo"],
        location: {
            type: "venue",
            location: "home",
        },
        startDate: new Date(),
        endDate: new Date(),
    },
    // Extra field
    {
        name: "Event 2",
        description: "Description 2",
        type: "type 2",
        category: "category 2",
        imageFile: { createReadStream: "", filename: "", mimetype: "" },
        languages: ["es"],
        tags: ["fiesta", "pinata"],
        location: {
            type: "online",
        },
        startDate: new Date(),
        endDate: new Date(),
        randomField: "hello",
    },
    // Missing description
    {
        name: "Event 3",
        type: "type 3",
        category: "category 3",
        imageFile: { createReadStream: "", filename: "", mimetype: "" },
        languages: ["fr"],
        tags: ["tag"],
        location: {
            type: "tbd",
        },
        startDate: new Date(),
        endDate: new Date(),
    },
    // Missing imageFile
    {
        name: "Event 4",
        description: "Description 4",
        type: "type 4",
        category: "category 4",
        languages: ["fr"],
        tags: ["tag"],
        location: {
            type: "tbd",
        },
        startDate: new Date(),
        endDate: new Date(),
    },
];

module.exports = {
    Events,
};
