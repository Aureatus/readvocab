import type { FastifyInstance } from "fastify";
import { getWords } from "../controllers/words.js";

const wordsRouter = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post("/", getWords);
};

export default wordsRouter;
