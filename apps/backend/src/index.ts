import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifyFormbody } from "@fastify/formbody";
import cors from "@fastify/cors";
import { fastify } from "fastify";
import { fastifyCompress } from "@fastify/compress";
import { fastifyMongodb } from "@fastify/mongodb";
import { FastifySSEPlugin } from "fastify-sse-v2";
import ajvKeywords from "ajv-keywords";
import fastifyHelmet from "@fastify/helmet";
import autoLoad from "@fastify/autoload";
import { fastifyEnv } from "@fastify/env";
import fluentSchemaObject from "fluent-json-schema";

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const environment =
  process.env["NODE_ENV"] === "production" ? "production" : "development";

const app = fastify({
  logger: envToLogger[environment],
  ajv: {
    plugins: [[ajvKeywords.default, ["transform"]]],
  },
});

const fluentSchema = fluentSchemaObject.default;
await app.register(fastifyEnv, {
  dotenv: true,
  schema: fluentSchema
    .object()
    .prop("PORT", fluentSchema.number().required())
    .prop("MONGO_URL", fluentSchema.string().required())
    .prop("JWT_SECRET", fluentSchema.string().required())
    .valueOf(),
});

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      MONGO_URL: string;
      JWT_SECRET: string;
    };
  }
}

await app.register(fastifyHelmet);
await app.register(fastifyCompress);
await app.register(fastifyMultipart, {
  limits: { files: 1, fileSize: 100000000 },
});
await app.register(fastifyFormbody);
await app.register(fastifyMongodb, {
  url: app.config.MONGO_URL,
  database: "Readvocab",
});
await app.register(cors);
await app.register(FastifySSEPlugin);

await app.register(autoLoad, {
  dir: join(dirName, "plugins"),
  options: {
    grammarClasstoRemove: [
      "NoC",
      "Prep",
      "Neg",
      "Num",
      "NoP",
      "NoP-",
      "Lett",
      "Int",
      "Inf",
      "Conj",
      "Pron",
      "Det",
      "DetP",
      "Gen",
      "Ex",
      "Uncl",
      "Fore",
    ],
  },
  forceESM: true,
});

await app.register(autoLoad, {
  dir: join(dirName, "routes"),
  forceESM: true,
});

const start = async (): Promise<void> => {
  try {
    await app.listen({ host: "0.0.0.0", port: app.config.PORT });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

await start();
