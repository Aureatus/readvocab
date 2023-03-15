import type { FastifyInstance } from "fastify";
import fluentSchemaObject from "fluent-json-schema";

import createCachedResult from "../../helpers/createCachedResult.js";
import findDefinitions from "../../helpers/findDefinitions.js";
import findRareWords from "../../helpers/findRareWords.js";
import getCachedResult from "../../helpers/getCachedResult.js";
import getDocProxy from "../../helpers/getDocProxy.js";
import mergeWordsAndDefs from "../../helpers/mergeWordsAndDefs.js";
import { wordsFromPDFThreaded } from "../../helpers/wordsFromPDFThreaded.js";
import Pdf from "../../models/pdf.js";

import type { PDFInfoType, WordQueryGeneric } from "../../types.js";

const fluentSchema = fluentSchemaObject.default;

const words = async (fastify: FastifyInstance): Promise<void> => {
  const QuerySchema = fluentSchema
    .object()
    .prop("id", fluentSchema.string().required());

  fastify.get<WordQueryGeneric>(
    "/",
    { schema: { querystring: QuerySchema } },
    async function saveWord(request, reply) {
      const { id } = request.query;

      const pdfResult = await Pdf.findById(id, "data -_id");

      return await reply.send(pdfResult?.data);
    }
  );

  fastify.post("/", async function words(request, _reply) {
    const corpus = this.corpus;

    const file = await request.file();
    if (file === undefined) throw Error("No file uploaded");
    await file.toBuffer(); // Will throw error if it is over allowed file size.
    // ONLY SEND LOADING STATE UPDATE IF TIME ELAPSED FROM LAST LOADING STATE HAS BEEN GREATER THAN 150MS.

    const fileBuffer = await file.toBuffer();
    const docProxy = await getDocProxy(fileBuffer);

    const docMetadata = (await docProxy.getMetadata()) ?? null;
    const info = docMetadata.info as PDFInfoType;
    const title = info["Title"] !== undefined ? info["Title"] : null;
    const creator = info["Author"] !== undefined ? info["Author"] : null;
    const creatorArray =
      creator !== null
        ? creator.replaceAll(" & ", "  ").replaceAll(" and ", "  ").split("  ")
        : null;

    if (title !== null && creatorArray !== null) {
      const cachedResult = await getCachedResult(title, creatorArray);
      if (cachedResult !== null) {
        return cachedResult;
      }
    }

    let words: string[] = await wordsFromPDFThreaded(docProxy, fileBuffer);

    let rareWords = findRareWords(words, 20, corpus);

    let rareWordDefinitions = await findDefinitions(rareWords);

    let rareWordObjects = mergeWordsAndDefs(rareWords, rareWordDefinitions);

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
      await createCachedResult(title, creatorArray, rareWordObjects);
    }
    return rareWordObjects;
  });
};

export default words;
