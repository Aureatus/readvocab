import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

type authenticateFunc = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<void>;

declare module "fastify" {
  interface FastifyInstance {
    authenticate: authenticateFunc;
  }
}

const authenticate: FastifyPluginAsync = async (instance, _opts) => {
  await instance.register(fastifyJwt, {
    secret: "testing",
  });

  instance.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        await reply.send(err);
      }
    }
  );
};

export default fp(authenticate);
