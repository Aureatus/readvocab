import { compare } from "bcrypt";
import type { FastifyInstance } from "fastify";
import fluentSchemaObject from "fluent-json-schema";

import User from "../../models/user.js";
import type { LoginGeneric } from "../../types.js";

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
      const { jwt } = this;

      const response = await User.findOne({ email }).exec();

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
