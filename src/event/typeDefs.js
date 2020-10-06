const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Event {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        description: String!
        type: String!
        category: String!
        languages: [String]!
        tags: [String]!
        location: EventLocation!
        startDate: DateTime!
        endDate: DateTime!
    }

    type EventLocation {
        type: String!
        location: String
    }

    input EventInput { 
        name: String!
        description: String!
        type: String!
        category: String!
        languages: [String]!
        tags: [String]!
        location: EventLocationInput!
        startDate: DateTime!
        endDate: DateTime!

    }

    input EventLocationInput {
        type: String!
        location: String
    }

    extend type Query {
        events: [Event]
        eventById(id: String): Event
    }

    extend type Mutation {
        createEvent(event: EventInput): Event
    }
`;

module.exports = {
    typeDefs
};