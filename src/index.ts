import { fastifyMultipart } from "@fastify/multipart";
import cors from "@fastify/cors";
import { fastify } from "fastify";
import { fastifyCompress } from "@fastify/compress";
import { fastifyMongodb } from "@fastify/mongodb";
import fastifyHelmet from "@fastify/helmet";
import wordsRouter from "./routes/wordsRouter.js";
import dotenv from "dotenv";
import corpus from "./plugins/corpus.js";

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

app.get("/dbtest", async (_req, reply) => {
  // Or this.mongo.client.db('mydb').collection('users')
  // @ts-expect-error
  const pdfCollection = app.mongo.db.collection("pdfs");

  // if the id is an ObjectId format, you need to create a new ObjectId
  const data = await pdfCollection.findOne();

  return await reply.send(data);
});

const start = async (): Promise<void> => {
  try {
    await app.listen({ host: "0.0.0.0", port });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

await start();
