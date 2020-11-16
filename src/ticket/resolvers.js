const { pinata } = require("@ipfs");
const { v4: uuid } = require("uuid");
const fs = require("fs");

const SOLD_SALE = 3;
const LISTED_SALE = 1;

const resolvers = {
    Query: {
        ticketsSalesByAccountName: async (_, args, { dataSources }) => {
            let myEventsIds = [];
            const events = await dataSources.eventAPI.getEventsByCreator(dataSources.eventAPI.context.userId);
            events.forEach((event) => {
                myEventsIds.push(event.id);
            });
            var ticketsByEventListed = [];
            var ticketsByEventSold = [];
            for (const eventId of myEventsIds) {
                const event = await dataSources.eventAPI.getEventById(eventId);
                const eventTicketsListed = await dataSources.atomicAssetsAPI.getEventTicketSalesByTemplateIds(
                    event.nftTemplates,
                    LISTED_SALE,
                );
                const eventTicketsSold = await dataSources.atomicAssetsAPI.getEventTicketSalesByTemplateIds(
                    event.nftTemplates,
                    SOLD_SALE,
                );
                ticketsByEventListed.push(eventTicketsListed);
                ticketsByEventSold.push(eventTicketsSold);
            }
            for (let i = 0; i < events.length; i++) {
                events[i].ticketsListedSale = ticketsByEventListed[i];
                events[i].ticketsSoldSale = ticketsByEventSold[i];
            }
            return events;
        },

        ticketSalesByEventIds: async (_, args, { dataSources }) => {
            var ticketsByEvent = [];
            for (const eventId of args.eventIds) {
                const event = await dataSources.eventAPI.getEventById(eventId);
                const eventTickets = await dataSources.atomicAssetsAPI.getEventTicketSalesByTemplateIds(
                    event.nftTemplates,
                );
                ticketsByEvent.push(eventTickets);
            }
            return ticketsByEvent;
        },
        ticketsForEventsByAccountName: async (_, args, { dataSources }) => {
            const {
                myTicketsByEvent,
                sellTicketsByEvent,
            } = await dataSources.atomicAssetsAPI.getEventTicketsByAccountName(args.accountName);

            const myTickets = {
                upcoming: [],
                past: [],
            };
            const sellTickets = [];

            await Promise.all(
                myTicketsByEvent.map(async (ticketsForEvent) => {
                    if (ticketsForEvent.eventId.match(/^[0-9a-fA-F]{24}$/)) {
                        const ticketForEventWithEventData = {
                            event: await dataSources.eventAPI.getEventById(ticketsForEvent.eventId),
                            tickets: ticketsForEvent.tickets,
                        };
                        if (ticketForEventWithEventData.event) {
                            if (Date.now() < ticketForEventWithEventData.event.endDate) {
                                myTickets.upcoming.push(ticketForEventWithEventData);
                            } else {
                                myTickets.past.push(ticketForEventWithEventData);
                            }
                        }
                    }
                }),
            );
            await Promise.all(
                sellTicketsByEvent.map(async (ticketsForEvent) => {
                    if (ticketsForEvent.eventId.match(/^[0-9a-fA-F]{24}$/)) {
                        const ticketForEventWithEventData = {
                            event: await dataSources.eventAPI.getEventById(ticketsForEvent.eventId),
                            tickets: ticketsForEvent.tickets,
                        };
                        if (ticketForEventWithEventData.event) {
                            sellTickets.push(ticketForEventWithEventData);
                        }
                    }
                }),
            );

            return { myTickets, sellTickets };
        },
        ticketByAssetId: async (_, args, { dataSources }) =>
            dataSources.atomicAssetsAPI.getTicketByAssetId(args.assetId),
        collectionsByAccountName: async (_, args, { dataSources }) =>
            dataSources.atomicAssetsAPI.getCollectionsByAccountName(args.accountName),
        ticketSchemasByAccountNameAndCollectionName: async (_, args, { dataSources }) =>
            dataSources.atomicAssetsAPI.getTicketSchemasByAccountNameAndCollectionName(
                args.accountName,
                args.collectionName,
            ),
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
