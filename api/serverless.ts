import { fastify } from "fastify";

import type { FastifyReply, FastifyRequest } from "fastify";

const app = fastify({
  logger: true,
  bodyLimit: 50 * 1024 * 1024,
});

// @ts-expect-error
await app.register(import("../src/index"), {
  prefix: "/",
});
export default async (
  req: FastifyRequest,
  res: FastifyReply
): Promise<void> => {
  await app.ready();
  app.server.emit("request", req, res);
};
