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
      const files = await request.saveRequestFiles();
      const filePath = files[0]?.filepath;
      const fileExtension = files[0]?.mimetype;

      if (filePath === undefined) throw Error("File not found");
      if (fileExtension !== "application/pdf")
        throw Error("Please upload a PDF.");

      yield { event: "loading", data: "Processing PDF" };
      const words = await wordsFromPDF(filePath);

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
