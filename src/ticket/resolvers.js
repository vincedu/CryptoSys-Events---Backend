const { pinata } = require("@ipfs");
const { v4: uuid } = require("uuid");
const fs = require("fs");

const resolvers = {
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
