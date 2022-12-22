import findRareWords from "../helpers/findRareWords.js";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { corpusInstance, CorpusWord } from "../types.js";

async function rareWords(
  this: FastifyInstance & { corpus?: corpusInstance },
  request: FastifyRequest<{ Body: string }>,
  _reply: FastifyReply
): Promise<CorpusWord[]> {
  const corpus = this.corpus;
  if (corpus === undefined) throw Error("Corpus not found.");
  const words: string[] = JSON.parse(request.body);
  const rareWords = findRareWords(words, 20, corpus);

  return rareWords;
}

export { rareWords };
