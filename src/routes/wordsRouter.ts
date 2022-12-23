import type { FastifyInstance } from "fastify";
import { pdfToWords } from "../controllers/pdfToWords.js";
import { rareWords } from "../controllers/rareWords.js";
import { words } from "../controllers/words.js";
import { wordsAndDefinitions } from "../controllers/wordsAndDefinitions.js";

const wordsRouter = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post("/words", words);
  fastify.post("/wordsFromPDF", pdfToWords);
  fastify.post<{ Body: string }>("/rareWords", rareWords);
  fastify.post<{ Body: string }>("/wordsAndDefinitions", wordsAndDefinitions);
};

export default wordsRouter;
