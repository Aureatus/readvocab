import findRareWords from "../helpers/findRareWords.js";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { CorpusWord } from "../types.js";

async function rareWords(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: string }>,
  _reply: FastifyReply
): Promise<CorpusWord[]> {
  const corpus = this.corpus;
  const words: string[] = JSON.parse(request.body);
  const rareWords = findRareWords(words, 20, corpus);

  return rareWords;
}

export { rareWords };
