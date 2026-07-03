import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Companhia da Beleza API",
    version: "1.0.0",
    description: "API REST para gerenciamento de agendamentos, profissionais, despesas e pagamentos do sistema Companhia da Beleza."
  },
  servers: [
     {
        url: "http://localhost:3000",
        description: "Ambiente local"
      },
      {
        url: "https://bfd-projeto-salao-backend.onrender.com",
        description: "Ambiente de produção"
      }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);