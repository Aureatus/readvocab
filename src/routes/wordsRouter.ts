import type { FastifyInstance } from "fastify";
import { words } from "../controllers/words.js";

const wordsRouter = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post("/", words);
};

export default wordsRouter;
