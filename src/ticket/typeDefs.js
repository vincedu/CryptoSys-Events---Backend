const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Ticket {
        templateId: String!
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

    type EventTicketSales {
        original: [EventTicketSalesByTemplate]!
        resale: [EventTicketSalesByTemplate]!
    }

    type EventTicketSalesByTemplate {
        template: TicketTemplate!
        sales: [TicketSale]
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

    input TicketImageInput {
        file: Upload!
        ticketName: String!
        eventName: String!
    }

    extend type Query {
        ticketSalesByEventId(eventId: String!): EventTicketSales
        ticketsByAccountName(accountName: String!): [Ticket]
        collectionsByAccountName(accountName: String!): [Collection]
    }

    extend type Mutation {
        pinTicketImageToIpfs(ticketImage: TicketImageInput): IpfsResponse
    }
`;

module.exports = {
    typeDefs,
};
