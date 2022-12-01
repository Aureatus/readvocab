import findDefinitions from "../helpers/findDefinitions.js";
import findRareWords from "../helpers/findRareWords.js";
import mergeWordsAndDefs from "../helpers/mergeWordsAndDefs.js";
import wordsFromPDF from "../helpers/wordsFromPDF.js";

import type { FastifyReply, FastifyRequest } from "fastify";
import type { DefinitionObject } from "../types.js";

const getWords = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<DefinitionObject[]> => {
  const files = await request.saveRequestFiles();
  const filePath = files[0]?.filepath;
  if (filePath === undefined) throw Error("File not found");
  const words = await wordsFromPDF(filePath);
  const rareWords = findRareWords(words, 20);
  const rareWordDefinitions = await findDefinitions(rareWords);

  return mergeWordsAndDefs(rareWords, rareWordDefinitions);
};

export { getWords };
