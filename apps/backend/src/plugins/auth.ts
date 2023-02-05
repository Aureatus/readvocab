import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import type { WithId } from "mongodb";
import type { JwtUser, UserData } from "../types.js";

type authenticateFunc = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<void>;

declare module "fastify" {
  interface FastifyInstance {
    authenticate: authenticateFunc;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: WithId<UserData>;
    user: JwtUser;
  }
}
const authenticate: FastifyPluginAsync = async (instance, _opts) => {
  const secret = instance.config.JWT_SECRET;

  await instance.register(fastifyJwt, {
    secret,
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
