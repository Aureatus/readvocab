import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { hash } from "bcrypt";
import type { User } from "../../types.js";

interface UserSignup extends User {
  confirmPassword: string;
}

async function signup(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: UserSignup }>,
  reply: FastifyReply
): Promise<void> {
  const { email, password, confirmPassword } = request.body;
  const { db } = this.mongo;
  const { jwt } = this;
  if (db === undefined) throw Error("Database Readvocab not found.");

  if (confirmPassword !== password)
    return await reply.code(400).send("Password confirmation doesn't match.");

  const userCollection = db.collection<User>("users");
  const response = await userCollection.findOne({ email });

  if (response !== null) {
    return await reply
      .code(400)
      .send("Account with that email already exists.");
  }

  const hashedPassword = await hash(password, 11);

  const insertResult = await userCollection.insertOne({
    email,
    password: hashedPassword,
    savedWords: [],
  });

  const user = await userCollection.findOne({ _id: insertResult.insertedId });
  if (user === null)
    return await reply.code(400).send("User not found after creation.");

  const token = jwt.sign(user, { expiresIn: "14d" });
  return await reply.code(201).send(token);
}

export default signup;
