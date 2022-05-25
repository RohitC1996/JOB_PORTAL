const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:8000',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
      {
          "name": "User",
          "description": "Endpoints"
      }
  ],
  securityDefinitions: {
      api_key: {
          type: "apiKey",
          name: "api_key",
          in: "header"
      },
      petstore_auth: {
          type: "oauth2",
          authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
          flow: "implicit",
          scopes: {
              read_pets: "read your pets",
              write_pets: "modify pets in your account"
          }
      }
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./Server.js'];


swaggerAutogen(outputFile, endpointsFiles, doc);