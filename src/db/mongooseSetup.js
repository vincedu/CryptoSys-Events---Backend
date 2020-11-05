const setupMongoose = () => {
    const mongoose = require("mongoose");
    mongoose.Promise = global.Promise;

    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });
    mongoose.connection.once("open", () => console.log("Connected to MongoDB."));
};

module.exports = {
    setupMongoose,
};
