import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Projeto Salão API",
    version: "1.0.0",
    description: "API for beauty salon booking system"
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server"
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);