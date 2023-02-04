import type { FastifyInstance } from "fastify";
import fluentSchemaObject from "fluent-json-schema";
import { compare, hash } from "bcrypt";

import type { LoginGeneric, SignupGeneric, User } from "../types.js";

const fluentSchema = fluentSchemaObject.default;

const authRouter = async (fastify: FastifyInstance): Promise<void> => {
  const loginBodySchema = fluentSchema
    .object()
    .prop("email", fluentSchema.string().format("email").required())
    .prop(
      "password",
      fluentSchema
        .string()
        .raw({ transform: ["trim"] })
        .minLength(8)
        .required()
    );

  const signupBodySchema = fluentSchema
    .object()
    .prop(
      "confirmPassword",
      fluentSchema
        .string()
        .raw({ transform: ["trim"] })
        .minLength(8)
        .required()
    )
    .extend(loginBodySchema);

  fastify.post<LoginGeneric>(
    "/login",
    { schema: { body: loginBodySchema } },
    async function (request, reply) {
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
  );

  fastify.post<SignupGeneric>(
    "/signup",
    { schema: { body: signupBodySchema } },
    async function signup(request, reply) {
      const { email, password, confirmPassword } = request.body;
      const { db } = this.mongo;
      const { jwt } = this;
      if (db === undefined) throw Error("Database Readvocab not found.");

      if (confirmPassword !== password)
        return await reply
          .code(400)
          .send("Password confirmation doesn't match.");

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

      const user = await userCollection.findOne({
        _id: insertResult.insertedId,
      });
      if (user === null)
        return await reply.code(400).send("User not found after creation.");

      const token = jwt.sign(user, { expiresIn: "14d" });
      return await reply.code(201).send(token);
    }
  );
};

export default authRouter;
