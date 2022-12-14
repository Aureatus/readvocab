import findDefinitions from "../helpers/findDefinitions.js";
import mergeWordsAndDefs from "../helpers/mergeWordsAndDefs.js";

import type { FastifyReply, FastifyRequest } from "fastify";
import type { CorpusWord, DefinitionWord } from "../types.js";

const wordsAndDefinitions = async (
  request: FastifyRequest<{ Body: string }>,
  _reply: FastifyReply
): Promise<DefinitionWord[]> => {
  const rareWords: CorpusWord[] = JSON.parse(request.body);
  const rareWordDefinitions = await findDefinitions(rareWords);

  return mergeWordsAndDefs(rareWords, rareWordDefinitions);
};

export { wordsAndDefinitions };
