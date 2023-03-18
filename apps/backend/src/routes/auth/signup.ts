import { hash } from "bcrypt";
import type { FastifyInstance } from "fastify";
import fluentSchema from "fluent-json-schema";

import User from "../../models/user.js";
import { loginBodySchema } from "./login.js";
import type { SignupGeneric } from "../../types.js";

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

const signup = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post<SignupGeneric>(
    "/signup",
    { schema: { body: signupBodySchema } },
    async function signup(request, reply) {
      const { email, password, confirmPassword } = request.body;
      const { jwt } = this;

      if (confirmPassword !== password)
        return await reply
          .code(400)
          .send("Password confirmation doesn't match.");

      const response =
        (await User.findOne({ email }).exec())?.toObject() ?? null;

      if (response !== null) {
        return await reply
          .code(400)
          .send("Account with that email already exists.");
      }

      const hashedPassword = await hash(password, 11);

      const user = await User.create({
        email,
        password: hashedPassword,
        savedWords: [],
      });

      if (user === null)
        return await reply.code(400).send("User not found after creation.");

      const token = jwt.sign(user.toObject(), { expiresIn: "14d" });
      return await reply.code(201).send(token);
    }
  );
};

export default signup;
