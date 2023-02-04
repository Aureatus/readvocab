import { compare } from "bcrypt";
import type { FastifyInstance } from "fastify";
import fluentSchemaObject from "fluent-json-schema";
import type { LoginGeneric, User } from "../../types.js";

const fluentSchema = fluentSchemaObject.default;
export const loginBodySchema = fluentSchema
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

const login = async (fastify: FastifyInstance): Promise<void> => {
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
};

export default login;
