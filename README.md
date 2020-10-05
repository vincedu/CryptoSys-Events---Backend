# CryptoSys Events - Backend

## To start development

### Environment variables

- Set environment variables by creating a .env file that contains these variables:

```
MONGODB_URI: Find it on MongoDB Atlas or ask team.
NODE_ENV: "development" or "prod"
NODE_PORT: Port the server is run on. (e.g. 4000)
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
