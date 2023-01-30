import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Db } from "mongodb";

import type { PDFInfoType } from "../types.js";

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
  await file.toBuffer(); // Will throw error if it is over allowed file size.
  // ONLY SEND LOADING STATE UPDATE IF TIME ELAPSED FROM LAST LOADING STATE HAS BEEN GREATER THAN 150MS.
  reply.sse(
    (async function* wordSSEGenerator() {
      try {
        let lastLoadingEventTime = Date.now();

        yield { event: "loading", data: "Processing PDF" };
        const fileBuffer = await file.toBuffer();
        const docProxy = await getDocProxy(fileBuffer);

        if (Date.now() - lastLoadingEventTime >= 150) {
          yield { event: "loading", data: "Searching for cached result." };
          lastLoadingEventTime = Date.now();
        }

        const docMetadata = (await docProxy.getMetadata()) ?? null;
        const info = docMetadata.info as PDFInfoType;
        const title = info["Title"] !== undefined ? info["Title"] : null;
        const creator = info["Author"] !== undefined ? info["Author"] : null;
        const creatorArray =
          creator !== null
            ? creator
                .replaceAll(" & ", "  ")
                .replaceAll(" and ", "  ")
                .split("  ")
            : null;

        if (title !== null && creatorArray !== null) {
          const cachedResult =
            db instanceof Db
              ? await getCachedResult(title, creatorArray, db)
              : null;
          if (cachedResult !== null) {
            yield { event: "result", data: JSON.stringify(cachedResult) };
            return;
          }
        }

        let words = await wordsFromPDF(docProxy);

        if (Date.now() - lastLoadingEventTime >= 150) {
          yield { event: "loading", data: "Finding rare words" };
          lastLoadingEventTime = Date.now();
        }
        let rareWords = findRareWords(words, 20, corpus);
        if (Date.now() - lastLoadingEventTime >= 150) {
          yield { event: "loading", data: "Finding word definitions" };
          lastLoadingEventTime = Date.now();
        }
        let rareWordDefinitions = await findDefinitions(rareWords);

        let rareWordObjects = mergeWordsAndDefs(rareWords, rareWordDefinitions);

        if (rareWordObjects.length < 20) {
          if (Date.now() - lastLoadingEventTime >= 150) {
            yield {
              event: "loading",
              data: "Finding more rare words and their definitions",
            };
            lastLoadingEventTime = Date.now();
          }
        }
        while (rareWordObjects.length < 20) {
          // Remove any words that have been already gotten in rareWords or rareWordsObjects
          words = words.filter((e) => {
            return rareWords.find((a) => a.word === e) === undefined;
          });

          rareWords = findRareWords(words, 20, corpus);

          rareWordDefinitions = await findDefinitions(rareWords);

          const newRareWordObjects = mergeWordsAndDefs(
            rareWords,
            rareWordDefinitions
          ).slice(0, 20 - rareWordObjects.length);

          rareWordObjects = [...rareWordObjects, ...newRareWordObjects];
        }

        if (title !== null && creatorArray !== null) {
          if (db instanceof Db) {
            await createCachedResult(title, creatorArray, db, rareWordObjects);
          }
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
