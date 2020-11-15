const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Ticket {
        templateId: String!
        templateMint: Int!
        assetId: String!
        owner: String!
        eventId: String
        name: String
        description: String
        image: String
    }

    type TicketTemplate {
        templateId: String!
        maxSupply: String!
        eventId: String!
        name: String!
        description: String!
        image: String!
    }

    type TicketSale {
        saleId: String!
        offerId: String!
        seller: String!
        price: TicketSalePrice!
        ticket: Ticket!
    }

    type TicketSalePrice {
        amount: Float!
        currency: String!
    }

    type TicketSalesByTemplate {
        template: TicketTemplate!
        sales: [TicketSale]!
    }

    type TicketSales {
        original: [TicketSalesByTemplate]!
        resale: [TicketSalesByTemplate]!
    }

    type EventTicketsByTemplate {
        template: TicketTemplate!
        tickets: [Ticket]
    }

    type EventTicket {
        event: Event!
        tickets: [EventTicketsByTemplate]!
    }

    type EventTickets {
        upcoming: [EventTicket]
        past: [EventTicket]
    }

    type Collection {
        collectionName: String!
        author: String!
    }

    type IpfsResponse {
        ipfsHash: String!
        pinSize: Int!
        timestamp: DateTime!
    }

    type EventWithTicketsSales {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        createdBy: String!
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
        tickets: TicketSales
    }

    input TicketImageInput {
        file: Upload!
        ticketName: String!
        eventName: String!
    }

    extend type Query {
        ticketSalesByEventIds(eventIds: [String!]): [TicketSales]
        ticketsForEventsByAccountName(accountName: String!): EventTickets
        ticketByAssetId(assetId: String!): Ticket
        collectionsByAccountName(accountName: String!): [Collection]
        ticketsSalesByAccountName(createdBy: String!): [EventWithTicketsSales]
    }

    extend type Mutation {
        pinTicketImageToIpfs(ticketImage: TicketImageInput): IpfsResponse
    }
`;

module.exports = {
    typeDefs,
};
