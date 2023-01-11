import type { FastifyInstance } from "fastify";
import login from "../controllers/auth/login.js";

const authRouter = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post("/login", login);
  fastify.post("/signup", () => {});
};

export default authRouter;
