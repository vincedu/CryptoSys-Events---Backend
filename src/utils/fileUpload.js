const { extname } = require("path");
const { v4: uuid } = require("uuid");
const { s3 } = require("@db/s3")

const uploadFile = (createReadStream, filename, mimetype) => {

    const fileKey = `public/${uuid()}${extname(filename)}`;
    // Setting up S3 upload parameters
    const params = {
        Key: fileKey,
        Body: createReadStream(),
        ContentType: mimetype,
    };

    // Uploading files to the bucket
    return new Promise((resolve, reject) => {
        s3.upload(params, function(err, data) {
            if (err) {
                reject(err);
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            resolve(data);
        });
    })
};

module.exports = {
    uploadFile
}
