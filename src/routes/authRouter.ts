import type { FastifyInstance } from "fastify";
import fluentSchemaObject from "fluent-json-schema";
import login from "../controllers/auth/login.js";
import signup from "../controllers/auth/signup.js";

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

  fastify.post("/login", { schema: { body: loginBodySchema } }, login);
  fastify.post("/signup", { schema: { body: signupBodySchema } }, signup);
};

export default authRouter;
