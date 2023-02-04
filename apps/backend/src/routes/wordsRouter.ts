import type { FastifyInstance } from "fastify";
import fluentSchemaObject from "fluent-json-schema";
import { ObjectId } from "@fastify/mongodb";
import { Db } from "mongodb";
import type { PDFInfoType, User, WordGeneric } from "../types.js";
import getRandomResult from "../helpers/getRandomResult.js";
import getDocProxy from "../helpers/getDocProxy.js";
import getCachedResult from "../helpers/getCachedResult.js";
import wordsFromPDF from "../helpers/wordsFromPDF.js";
import findRareWords from "../helpers/findRareWords.js";
import createCachedResult from "../helpers/createCachedResult.js";
import findDefinitions from "../helpers/findDefinitions.js";
import mergeWordsAndDefs from "../helpers/mergeWordsAndDefs.js";

const fluentSchema = fluentSchemaObject.default;

const wordsRouter = async (fastify: FastifyInstance): Promise<void> => {
  const BodySchema = fluentSchema
    .object()
    .prop("word", fluentSchema.string().required())
    .prop("wordClass", fluentSchema.string().required())
    .prop("definition", fluentSchema.string().required());
  fastify.post("/", async function words(request, reply) {
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

          let rareWordObjects = mergeWordsAndDefs(
            rareWords,
            rareWordDefinitions
          );

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
              await createCachedResult(
                title,
                creatorArray,
                db,
                rareWordObjects
              );
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
  });
  fastify.get("/random", async function randomWords(_request, reply) {
    const { db } = this.mongo;
    // ONLY SEND LOADING STATE UPDATE IF TIME ELAPSED FROM LAST LOADING STATE HAS BEEN GREATER THAN 150MS.
    reply.sse(
      (async function* wordSSEGenerator() {
        try {
          let lastLoadingEventTime = Date.now();

          yield { event: "loading", data: "Processing PDF" };
          if (Date.now() - lastLoadingEventTime >= 150) {
            yield { event: "loading", data: "Searching for cached result." };
            lastLoadingEventTime = Date.now();
          }

          const cachedResult =
            db instanceof Db ? await getRandomResult(db) : null;
          if (cachedResult !== null) {
            yield { event: "result", data: JSON.stringify(cachedResult) };
            return;
          }
        } catch (err) {
          yield {
            event: "error",
            data: err instanceof Error ? err.message : "Unknown Error.",
          };
        }
      })()
    );
  });
  fastify.post<WordGeneric>(
    "/save",
    { onRequest: [fastify.authenticate], schema: { body: BodySchema } },
    async function saveWord(request, reply) {
      const { _id } = request.user;
      const { db } = this.mongo;
      if (db === undefined) throw Error("Database Readvocab not found.");

      const userCollection = db.collection<User>("users");
      const word = request.body;

      const updateResponse = await userCollection.updateOne(
        { _id: new ObjectId(_id) },
        { $addToSet: { savedWords: word } }
      );

      if (!updateResponse.acknowledged) {
        return await reply.code(500).send("Failed to save word.");
      }

      if (updateResponse.modifiedCount === 0) {
        return await reply.code(500).send("Word is already saved!");
      }

      return await reply.send();
    }
  );
  fastify.post<WordGeneric>(
    "/delete",
    { onRequest: [fastify.authenticate], schema: { body: BodySchema } },
    async function deleteWord(request, reply) {
      const { _id } = request.user;
      const { db } = this.mongo;
      if (db === undefined) throw Error("Database Readvocab not found.");

      const userCollection = db.collection<User>("users");
      const word = request.body;

      const updateResponse = await userCollection.updateOne(
        { _id: new ObjectId(_id) },
        { $pull: { savedWords: word } }
      );

      if (!updateResponse.acknowledged) {
        return await reply.code(500).send("Failed to delete word.");
      }

      if (updateResponse.modifiedCount === 0) {
        return await reply.code(500).send("Word isn't saved!");
      }

      return await reply.send();
    }
  );
  fastify.get(
    "/saved",
    { onRequest: [fastify.authenticate] },
    async function savedWords(request, reply) {
      const { _id } = request.user;
      const { db } = this.mongo;
      if (db === undefined) throw Error("Database Readvocab not found.");

      const userCollection = db.collection<User>("users");

      const response = await userCollection.findOne(
        { _id: new ObjectId(_id) },
        { projection: { savedWords: 1 } }
      );

      const data = response?.savedWords ?? null;

      return await reply.send(data);
    }
  );
};

export default wordsRouter;
