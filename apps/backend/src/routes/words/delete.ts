import type { FastifyInstance } from "fastify";
import type { WordGeneric } from "../../types.js";
import fluentSchema from "fluent-json-schema";
import User from "../../models/user.js";

const deleteWord = async (fastify: FastifyInstance): Promise<void> => {
  const BodySchema = fluentSchema
    .object()
    .prop("word", fluentSchema.string().required())
    .prop("wordClass", fluentSchema.string().required())
    .prop("definition", fluentSchema.string().required());

  fastify.post<WordGeneric>(
    "/delete",
    { onRequest: [fastify.authenticate], schema: { body: BodySchema } },
    async function deleteWord(request, reply) {
      const { _id } = request.user;

      const word = request.body;

      const updateResponse = await User.findByIdAndUpdate(_id, {
        $pull: { savedWords: word },
      }).exec();

      if (updateResponse === null) {
        return await reply.code(500).send("Failed to delete word.");
      }

      return await reply.send();
    }
  );
};

export default deleteWord;
