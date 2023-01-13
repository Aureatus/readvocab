import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { compare } from "bcrypt";
import type { User } from "../../types.js";

async function login(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: User }>,
  reply: FastifyReply
): Promise<void> {
  const { email, password } = request.body;
  const { db } = this.mongo;
  const { jwt } = this;
  if (db === undefined) throw Error("Database Readvocab not found.");

  const userCollection = db.collection<User>("users");
  const response = await userCollection.findOne({ email });

  if (response === null) {
    return await reply.code(401).send("Account with email doesn't exist.");
  }

  const passwordValidity = await compare(password, response.password);

  if (!passwordValidity) {
    return await reply.code(401).send("Incorrect password.");
  }

  const token = jwt.sign(response, { expiresIn: "14d" });
  return await reply.send(token);
}

export default login;
