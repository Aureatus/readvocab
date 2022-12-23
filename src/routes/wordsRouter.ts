import type { FastifyInstance } from "fastify";
import { words } from "../controllers/words.js";

const wordsRouter = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post("/words", words);
};

export default wordsRouter;
