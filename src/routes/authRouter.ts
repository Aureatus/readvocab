import type { FastifyInstance } from "fastify";
import login from "../controllers/auth/login.js";
import signup from "../controllers/auth/signup.js";

const authRouter = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post("/login", login);
  fastify.post("/signup", signup);
};

export default authRouter;
