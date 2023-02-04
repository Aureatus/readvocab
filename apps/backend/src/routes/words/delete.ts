import type { FastifyInstance } from "fastify";
import type { User, WordGeneric } from "../../types.js";
import fluentSchemaObject from "fluent-json-schema";
import { ObjectId } from "@fastify/mongodb";

const fluentSchema = fluentSchemaObject.default;

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
};

export default deleteWord;
