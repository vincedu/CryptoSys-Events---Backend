require("dotenv").config();
require("module-alias/register");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { setupMongoose } = require("@db/mongooseSetup");
const { setupFirebase } = require("./auth/firebaseSetup");
const { schema } = require("./schema");

const isDevelopmentEnv = process.env.NODE_ENV === "development";

const app = express();
const server = new ApolloServer({
    ...schema,
    playground: isDevelopmentEnv,
});
server.applyMiddleware({ app });

setupMongoose();
setupFirebase();

// To import all MongoDB events to Algolia
// const { mongoToAlgolia } = require("@utils");
// mongoToAlgolia()

app.listen({ port: process.env.NODE_PORT }, () => {
    console.log(`Server started at http://localhost:${process.env.NODE_PORT}${server.graphqlPath}.`);
});
