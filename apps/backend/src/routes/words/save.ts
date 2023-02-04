import type { FastifyInstance } from "fastify";
import type { User, WordGeneric } from "../../types.js";
import fluentSchemaObject from "fluent-json-schema";
import { ObjectId } from "@fastify/mongodb";

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
};

export default save;
