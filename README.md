# Spectacular - Backend

## To start development

### Environment variables

- Set environment variables by creating a .env file that contains these variables:

```
MONGODB_URI = Find it on MongoDB Atlas or ask team.
NODE_ENV = "development" or "prod"
NODE_PORT = Port the server is run on. (e.g. 4000)

AWS_ACCESS_KEY_ID = AWS Access key ID
AWS_SECRET_ACCESS_KEY = AWS Secret access key
AWS_S3_REGION = AWS Region in which S3 db is hosted
AWS_S3_BUCKET = AWS S3 bucket name

PINATA_API_KEY = c6be6d92fb16ddce6453
PINATA_SECRET_API_KEY = a603f42dd1e724213c320f536c2f074f5f371da8118753fbec849aac693e3653

GOOGLE_APPLICATION_CREDENTIALS = Google service account key

ALGOLIASEARCH_APPLICATION_ID = Application ID for Algoliasearch
ALGOLIASEARCH_API_KEY = Admin API key for Algoliasearch
```

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

