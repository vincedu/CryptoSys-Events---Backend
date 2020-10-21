const { gql } = require("apollo-server-express");

const typeDefs = gql`
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

    extend type Mutation {
        pinTicketImageToIpfs(ticketImage: TicketImageInput): IpfsResponse
    }
`;

module.exports = {
    typeDefs,
};
