const { Event } = require("./model");
const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");

module.exports = {
    Event,
    resolvers,
    typeDefs,
};