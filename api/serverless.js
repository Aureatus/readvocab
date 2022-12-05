"use strict";
import Fastify from "fastify";

const app = Fastify({
  logger: true,
  bodyLimit: 50 * 1024 * 1024,
});

app.register(import("../src/index"));

export default async (req, res) => {
  await app.ready();
  app.server.emit("request", req, res);
};
