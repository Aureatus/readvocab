import type { FastifyInstance } from "fastify";
import fluentSchemaObject from "fluent-json-schema";
import deleteWord from "../controllers/deleteWord.js";
import savedWords from "../controllers/getSavedWords.js";
import randomWords from "../controllers/randomWords.js";
import { saveWord } from "../controllers/saveWord.js";
import { words } from "../controllers/words.js";
import type { DefinitionWord } from "../types.js";

const fluentSchema = fluentSchemaObject.default;

const wordsRouter = async (fastify: FastifyInstance): Promise<void> => {
  const BodySchema = fluentSchema
    .object()
    .prop("word", fluentSchema.string().required())
    .prop("wordClass", fluentSchema.string().required())
    .prop("definition", fluentSchema.string().required());
  fastify.post("/", words);
  fastify.get("/random", randomWords);
  fastify.post<{ Body: DefinitionWord }>(
    "/save",
    { onRequest: [fastify.authenticate], schema: { body: BodySchema } },
    saveWord
  );
  fastify.post<{ Body: DefinitionWord }>(
    "/delete",
    { onRequest: [fastify.authenticate], schema: { body: BodySchema } },
    deleteWord
  );
  fastify.get("/saved", { onRequest: [fastify.authenticate] }, savedWords);
};

export default wordsRouter;
