import findRareWords from "../helpers/findRareWords.js";

import type { FastifyReply, FastifyRequest } from "fastify";
import type { CorpusWord } from "../types.js";

const rareWords = async (
  request: FastifyRequest<{ Body: string }>,
  _reply: FastifyReply
): Promise<CorpusWord[]> => {
  const words: string[] = JSON.parse(request.body);
  const rareWords = findRareWords(words, 20);

  return rareWords;
};

export { rareWords };
