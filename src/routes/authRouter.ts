import type { FastifyInstance } from "fastify";

const authRouter = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post("/login", () => {});
  fastify.post("/signup", () => {});
};

export default authRouter;
