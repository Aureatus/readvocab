import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import findDefinitions from "../helpers/findDefinitions.js";
import findRareWords from "../helpers/findRareWords.js";
import mergeWordsAndDefs from "../helpers/mergeWordsAndDefs.js";
import wordsFromPDF from "../helpers/wordsFromPDF.js";

async function words(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const corpus = this.corpus;

  reply.sse(
    (async function* wordSSEGenerator() {
      const file = await request.file();
      if (file === undefined) throw Error("No file uploaded");

      yield { event: "loading", data: "Processing PDF" };
      const words = await wordsFromPDF(await file.toBuffer());

      yield { event: "loading", data: "Finding rare words" };
      const rareWords = findRareWords(words, 20, corpus);

      yield { event: "loading", data: "Finding word definitions" };
      const rareWordDefinitions = await findDefinitions(rareWords);

      const rareWordObjects = mergeWordsAndDefs(rareWords, rareWordDefinitions);
      yield { event: "result", data: JSON.stringify(rareWordObjects) };
    })()
  );
}

export { words };
