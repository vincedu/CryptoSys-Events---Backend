const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Event {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        createdBy: String!
        createdByDisplayName: String!
        name: String!
        description: String!
        type: String!
        category: String!
        image: String
        languages: [String]!
        tags: [String]!
        location: EventLocation!
        startDate: DateTime!
        endDate: DateTime!
        nftTemplates: [String]
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
        imageFile: Upload!
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

    input ModifyEventInput {
        name: String
        description: String
        type: String
        category: String
        imageFile: Upload
        languages: [String]
        tags: [String]
        location: ModifyEventLocationInput
        startDate: DateTime
        endDate: DateTime
    }

    input ModifyEventLocationInput {
        type: String
        location: String
    }

    extend type Query {
        events: [Event]
        eventById(id: String): Event
        eventsByIds(ids: [String]): [Event]
        distinct(attribute: String): [String]
        eventsByParam(
            category: String
            name: String
            tags: [String]
            languages: [String]
            type: String
            date: DateTime
            offset: Int
            limit: Int
        ): [Event]
        eventsByCreator: [Event]
    }

    extend type Mutation {
        createEvent(event: EventInput): Event
        modifyEvent(eventId: String!, event: ModifyEventInput): Event
        linkNftTemplatesToEvent(eventId: String!, templateIds: [String]!): Event
    }
`;

module.exports = {
    typeDefs,
};
