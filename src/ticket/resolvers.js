const { pinata } = require("@ipfs");
const { v4: uuid } = require("uuid");
const fs = require("fs");

const resolvers = {
    Query: {
        ticketSalesByEventId: async (_, args, { dataSources }) => {
            const event = await dataSources.eventAPI.getEventById(args.eventId);
            return dataSources.atomicAssetsAPI.getEventTicketSalesByTemplateIds(event.nftTemplates);
        },
        ticketsForEventsByAccountName: async (_, args, { dataSources }) => {
            const ticketsByEvent = await dataSources.atomicAssetsAPI.getEventTicketsByAccountName(args.accountName);

            console.log("TICKETS:", ticketsByEvent);
            const sortedEventTickets = {
                upcoming: [],
                past: [],
            };

            await Promise.all(
                ticketsByEvent.map(async (ticketsForEvent) => {
                    if (ticketsForEvent.eventId.match(/^[0-9a-fA-F]{24}$/)) {
                        const ticketForEventWithEventData = {
                            event: await dataSources.eventAPI.getEventById(ticketsForEvent.eventId),
                            tickets: ticketsForEvent.tickets,
                        };
                        if (ticketForEventWithEventData.event) {
                            if (Date.now() < ticketForEventWithEventData.event.endDate) {
                                sortedEventTickets.upcoming.push(ticketForEventWithEventData);
                            } else {
                                sortedEventTickets.past.push(ticketForEventWithEventData);
                            }
                        }
                    }
                }),
            );

            return sortedEventTickets;
        },
        ticketByAssetId: async (_, args, { dataSources }) =>
            dataSources.atomicAssetsAPI.getTicketByAssetId(args.assetId),
        collectionsByAccountName: async (_, args, { dataSources }) =>
            dataSources.atomicAssetsAPI.getCollectionsByAccountName(args.accountName),
    },
    Mutation: {
        pinTicketImageToIpfs: async (_, args) => {
            const { file, eventName, ticketName } = args.ticketImage;
            const { createReadStream } = await file;
            const readableStreamForFile = createReadStream();

            const tempFileName = uuid();
            const writeStreamForTempFile = fs.createWriteStream(tempFileName);
            readableStreamForFile.pipe(writeStreamForTempFile);
            await new Promise((resolve) => {
                readableStreamForFile.on("end", () => {
                    resolve();
                });
            });
            const readStream = fs.createReadStream(tempFileName);

            const name = `${eventName}_${ticketName}`;
            const options = {
                pinataMetadata: {
                    name: name,
                },
                pinataOptions: {
                    cidVersion: 1,
                },
            };

            const result = await pinata.pinFileToIPFS(readStream, options);
            fs.unlink(tempFileName, (error) => {
                if (error) {
                    console.log("Error deleting temporary ticket image file: ", error);
                } else {
                    console.log("Successfully deleted temporary ticket image file");
                }
            });
            console.log("Pinned Ticket Image to IPFS with hash: ", result);
            return {
                ipfsHash: result.IpfsHash,
                pinSize: result.PinSize,
                timestamp: result.Timestamp,
            };
        },
    },
};

module.exports = {
    resolvers,
};
