# Spectacular - Backend

The Spectacular backend is a GraphQL API built using Apollo Server. It is mainly used to handle requests for event creation/modification and event queries. However, it is additionally used by the frontend to fetch and process NFT ticket data from the AtomicAssetsAPI. Request authentification is done using Firebase. User data can also fetched from the user data API hosted on Firebase.

The queries and mutations that are supported for events or tickets can be found in the type definition files (`typeDefs.js`) in the respective `src/event` or `src/ticket` folders. Their implementations are located in the `resolvers.js` in their respective folders.

## Requirements
- NodeJS 12 (Only tested on 12.18.4)

### External dependencies

These external dependencies need to be setup beforehand for the backend to fully function properly.

##### MongoDB
Event data is stored in a MongoDB database. That database need to be setup and the MongoDB URI needs to be configured in the environment variables (see environment variables section). MongoDB Atlas is a simple solution for hosting a MongoDB database in the cloud. Using Atlas, the MongoDB URI can simply be found in the Atlas console. 

##### Firebase
Firebase is used in the application for authentification and storing user data, such as display names and links to eos account names. To be able to run the backend, a Firebase project needs to be initialized and configured (environment variables should be set, see environment variables section). The user data API (source code located in the our firebase repository) should also be deployed to the Firebase project's Cloud Functions to enable the backend to fetch user data.

##### Pinata
The Pinata API is used to upload and pin images to the IPFS. The Pinata API is abstracted for our frontend by our backend GraphQL API. A pinata account should be setup and configured in the environment variables.

##### Algoliasearch
Algoliasearch is used in the application for the event search and filtering functionalities. The Algoliasearch API client package is used in the backend to allow for event data indexing on event creation. An Algolia account should be setup and configured in the environment variables.

##### AWS S3
AWS S3 is simply used for event image storage. An AWS S3 bucket needs to be created and configured in the environment variables. Additionally, public access needs to be granted to a `/public/` folder in your S3 bucket to allow users to see event images that are uploaded.

##### AtomicAssets API
The backend application makes calls to the AtomicAssets API to fetch data for assets and to the AtomicMarket API for asset sales.

WAX testnet:
- AtomicAssets: https://test.wax.api.atomicassets.io/atomicassets/docs/
- AtomicMarket: https://test.wax.api.atomicassets.io/atomicmarket/docs/
WAX net:
- AtomicAssets: https://wax.api.atomicassets.io/atomicassets/docs/
- AtomicMarket: https://wax.api.atomicassets.io/atomicmarket/docs/


## Configuration

### Environment variables

- You can set environment variables by creating a .env file that contains these variables:

```
NODE_ENV = "development" or "prod"
NODE_PORT = Port the server is run on. (e.g. 4000)

MONGODB_URI = Find it on MongoDB Atlas

AWS_ACCESS_KEY_ID = AWS Access key ID
AWS_SECRET_ACCESS_KEY = AWS Secret access key
AWS_S3_REGION = AWS Region in which S3 db is hosted
AWS_S3_BUCKET = AWS S3 bucket name

PINATA_API_KEY = API key for Pinata
PINATA_SECRET_API_KEY = Secret API key for Pinata

GOOGLE_APPLICATION_CREDENTIALS = path to the file containing your Google service account key (see https://firebase.google.com/docs/admin/setup#initialize-sdk)

ALGOLIASEARCH_APPLICATION_ID = Application ID for Algoliasearch
ALGOLIASEARCH_API_KEY = Admin API key for Algoliasearch
```

## To start development

### VSCode specific

- Install eslint extension from Marketplace
- Set eslint as defaultFormatter for workspace and set format on save:

```
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
},
"[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
}

```

- (optional) Install Apollo GraphQL extension for GQL syntax highlighting

## Tech/framework used

### Apollo Server V2 / Express.js
The server is built with the Express.js integration of the Apollo GraphQL Server.

https://www.apollographql.com/docs/apollo-server/

### Mongoose
Access to the MongoDB database is done using the Mongoose package.

https://mongoosejs.com/docs/index.html

### Firebase

Authentification to the application is done using Firebase. Therefore, backend request authentification uses the Firebase admin sdk package.

https://firebase.google.com/docs/reference/admin/node

### AWS SDK 

To access AWS S3 for image upload and storage, the backend uses the AWS SDK package.

https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html


### Pinata SDK

To make calls to the Pinata API, the backend uses the Pinata SDK package.

https://github.com/PinataCloud/Pinata-SDK

### Algoliasearch 

To make calls to Algolia API, the backend uses the algoliasearch package.

https://github.com/algolia/algoliasearch-client-javascript#readme