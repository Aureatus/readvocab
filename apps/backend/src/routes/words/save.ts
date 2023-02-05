import type { FastifyInstance } from "fastify";
import type { WordGeneric } from "../../types.js";
import fluentSchemaObject from "fluent-json-schema";
import User from "../../models/user.js";

const fluentSchema = fluentSchemaObject.default;

const save = async (fastify: FastifyInstance): Promise<void> => {
  const BodySchema = fluentSchema
    .object()
    .prop("word", fluentSchema.string().required())
    .prop("wordClass", fluentSchema.string().required())
    .prop("definition", fluentSchema.string().required());

  fastify.get(
    "/saved",
    { onRequest: [fastify.authenticate] },
    async function savedWords(request, reply) {
      const { _id } = request.user;

      const response = await User.findById(_id, "savedWords").exec();

      const data = response?.savedWords ?? null;

      return await reply.send(data);
    }
  );

  fastify.post<WordGeneric>(
    "/save",
    { onRequest: [fastify.authenticate], schema: { body: BodySchema } },
    async function saveWord(request, reply) {
      const { _id } = request.user;
      const word = request.body;

      const updateResponse = await User.findOneAndUpdate(
        { _id },
        { $addToSet: { savedWords: word } }
      ).exec();

      if (updateResponse === null) {
        return await reply.code(500).send("Failed to save word.");
      }

      return await reply.send();
    }
  );
};

export default save;
