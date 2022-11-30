import { fastify } from "fastify";
import wordsRouter from "./routes/wordsRouter.js";

const app = fastify({ logger: true });
const port = 3000;

await app.register(wordsRouter, { prefix: "/words" });

const start = async (): Promise<void> => {
  try {
    await app.listen({ port });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

await start();
