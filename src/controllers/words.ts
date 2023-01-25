import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Db } from "mongodb";

import type { Metadata } from "pdfjs-dist/types/src/display/metadata.js";
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
        const metadata = docMetadata.metadata as Metadata | null;
        const info = docMetadata.info as PDFInfoType;
        const title =
          metadata !== null
            ? metadata.get("dc:title")
            : info["Title"] !== undefined
            ? info["Title"]
            : null;
        const creator =
          metadata !== null
            ? metadata.get("dc:creator")
            : info["Author"] !== undefined
            ? [info["Author"]]
            : null;

        if (
          typeof title === "string" &&
          Array.isArray(creator) &&
          creator.length > 0
        ) {
          const cachedResult =
            db instanceof Db ? await getCachedResult(title, creator, db) : null;
          if (cachedResult !== null) {
            yield { event: "result", data: JSON.stringify(cachedResult) };
            return;
          }
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

        if (
          typeof title === "string" &&
          Array.isArray(creator) &&
          creator.length > 0
        ) {
          if (db instanceof Db) {
            await createCachedResult(title, creator, db, rareWordObjects);
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
