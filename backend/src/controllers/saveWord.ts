import { ObjectId } from "@fastify/mongodb";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { DefinitionWord, User } from "../types.js";

async function saveWord(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: DefinitionWord }>,
  reply: FastifyReply
): Promise<void> {
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

export { saveWord };
