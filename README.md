# CryptoSys Events - Backend

## To start development

### Environment variables

- Set environment variables by creating a .env file that contains these variables:

```
MONGODB_URI: Find it on MongoDB Atlas or ask team.
NODE_ENV: "development" or "prod"
NODE_PORT: Port the server is run on. (e.g. 4000)

AWS_ACCESS_KEY_ID: AWS Access key ID
AWS_SECRET_ACCESS_KEY: AWS Secret access key
AWS_S3_REGION: AWS Region in which S3 db is hosted
AWS_S3_BUCKET: AWS S3 bucket name

GOOGLE_APPLICATION_CREDENTIALS: Google service account key
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
