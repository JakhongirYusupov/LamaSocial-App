import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import "../config.js";
import { graphqlUploadExpress } from "graphql-upload";
import schema from "./modules/index.js";

(async function () {
  const app = express();
  app.use(graphqlUploadExpress());

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    context: ({ req }) => {
      return req.headers;
    },
    introspection: true,
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT || 4000 }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT || 4000}${
      server.graphqlPath
    }`
  );
})();
