import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import swaggerUi from "swagger-ui-express";
import { env } from "../config/envValidator.js";

// Import mapping logic
import registerDocs from "../swagger/index.js";

// Ensure zod is extended
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

export const swaggerDocs = (app) => {
  // Register all structured endpoints
  registerDocs();

  // Generate the OpenAPI spec definition
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const swaggerSpec = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Notifier API",
      version: "1.0.0",
      description: "API documentation for Notifier Backend",
    },
    servers: [
      {
        url: `${env.BASE_URL}`,
        description: "Development server",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger docs available at ${env.BASE_URL}/api-docs"`);
};
