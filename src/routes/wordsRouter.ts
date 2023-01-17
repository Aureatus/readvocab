import type { FastifyInstance } from "fastify";
import fluentSchemaObject from "fluent-json-schema";
import savedWords from "../controllers/getSavedWords.js";
import { saveWord } from "../controllers/saveWord.js";
import { words } from "../controllers/words.js";
import type { DefinitionWord } from "../types.js";

const fluentSchema = fluentSchemaObject.default;

const wordsRouter = async (fastify: FastifyInstance): Promise<void> => {
  const saveBodySchema = fluentSchema
    .object()
    .prop("word", fluentSchema.string().required())
    .prop("wordClass", fluentSchema.string().required())
    .prop("definition", fluentSchema.string().required());
  fastify.post("/", words);
  fastify.post<{ Body: DefinitionWord }>(
    "/save",
    { onRequest: [fastify.authenticate], schema: { body: saveBodySchema } },
    saveWord
  );
  fastify.get<{ Body: DefinitionWord }>(
    "/saved",
    { onRequest: [fastify.authenticate] },
    savedWords
  );
};

export default wordsRouter;
