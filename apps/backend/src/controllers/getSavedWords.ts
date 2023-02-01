import { ObjectId } from "@fastify/mongodb";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { User } from "../types.js";

async function savedWords(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
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

export default savedWords;
