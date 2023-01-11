import { fastifyMultipart } from "@fastify/multipart";
import cors from "@fastify/cors";
import { fastify } from "fastify";
import { fastifyCompress } from "@fastify/compress";
import { fastifyMongodb } from "@fastify/mongodb";
import { FastifySSEPlugin } from "fastify-sse-v2";
import fastifyHelmet from "@fastify/helmet";
import fastifyAuth from "@fastify/auth";
import fastifyJwt from "@fastify/jwt";
import wordsRouter from "./routes/wordsRouter.js";
import dotenv from "dotenv";
import corpus from "./plugins/corpus.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();

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
  bodyLimit: 50 * 1024 * 1024,
});
let port = Number(process.env["PORT"]);

if (isNaN(port)) port = 3000;

const mongoURL = process.env["MONGO_URL"];
if (mongoURL === undefined) throw Error("No mongoURL found.");

await app.register(fastifyHelmet);
await app.register(fastifyCompress);
await app.register(fastifyMultipart);
await app.register(fastifyMongodb, { url: mongoURL, database: "Readvocab" });
await app.register(cors);
await app.register(FastifySSEPlugin);
await app.register(fastifyAuth);
await app.register(fastifyJwt, { secret: "testing" });

await app.register(corpus, {
  grammarClasstoRemove: [
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
});

await app.register(wordsRouter);
await app.register(authRouter, { prefix: "/auth" });

const start = async (): Promise<void> => {
  try {
    await app.listen({ port });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

await start();
