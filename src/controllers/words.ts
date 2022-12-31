import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Db } from "mongodb";

import findDefinitions from "../helpers/findDefinitions.js";
import findRareWords from "../helpers/findRareWords.js";
import getDocProxy from "../helpers/getDocProxy.js";
import mergeWordsAndDefs from "../helpers/mergeWordsAndDefs.js";
import wordsFromPDF from "../helpers/wordsFromPDF.js";
import getCachedResult from "../helpers/getCachedResult.js";
import createCachedResult from "../helpers/createCachedResult.js";

async function words(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const corpus = this.corpus;
  const { db } = this.mongo;
  const file = await request.file();
  if (file === undefined) throw Error("No file uploaded");

  // ONLY SEND LOADING STATE UPDATE IF TIME ELAPSED FROM LAST LOADING STATE HAS BEEN GREATER THAN 150MS.
  reply.sse(
    (async function* wordSSEGenerator() {
      try {
        let lastLoadingEventTime = Date.now();

        yield { event: "loading", data: "Processing PDF" };
        const fileBuffer = await file.toBuffer();
        const docProxy = await getDocProxy(fileBuffer);

        const cachedResult =
          db instanceof Db ? await getCachedResult(docProxy, db) : null;
        if (cachedResult !== null) {
          yield { event: "result", data: JSON.stringify(cachedResult) };
          return;
        }

        const words = await wordsFromPDF(docProxy);

        if (Date.now() - lastLoadingEventTime >= 150) {
          yield { event: "loading", data: "Finding rare words" };
          lastLoadingEventTime = Date.now();
        }
        const rareWords = findRareWords(words, 20, corpus);
        if (Date.now() - lastLoadingEventTime >= 150) {
          yield { event: "loading", data: "Finding word definitions" };
          lastLoadingEventTime = Date.now();
        }
        const rareWordDefinitions = await findDefinitions(rareWords);

        const rareWordObjects = mergeWordsAndDefs(
          rareWords,
          rareWordDefinitions
        );

        if (db instanceof Db) {
          await createCachedResult(docProxy, db, rareWordObjects);
        }
        yield { event: "result", data: JSON.stringify(rareWordObjects) };
      } catch (err) {
        yield {
          event: "error",
          data: err instanceof Error ? err.message : "Unknown Error.",
        };
      }
    })()
  );
}

export { words };
