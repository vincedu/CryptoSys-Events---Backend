const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const EventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        languages: [{
            type: String,
            default: [],
            required: true,
        }],
        tags: [{
            type: String,
            default: [],
            required: true,
        }],
        location: {
            type: {
                type: String,
                required: true,
            },
            location: {
                type: String,
                required: false,
            },
        },
        startDate: {
            type: Date,
            require: true,
        },
        endDate: {
            type: Date,
            require: true,
        },
    },
    {
        collection: "events",
    }
);

EventSchema.plugin(timestamps);

EventSchema.index({ createdAt: 1, updatedAt: 1 });

const Event = mongoose.model("Event", EventSchema);

module.exports = {
    Event
}