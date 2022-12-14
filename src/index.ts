import { fastifyMultipart } from "@fastify/multipart";
import cors from "@fastify/cors";
import { fastify } from "fastify";
import wordsRouter from "./routes/wordsRouter.js";
import dotenv from "dotenv";

dotenv.config();

const app = fastify({
  logger: true,
  bodyLimit: 50 * 1024 * 1024,
});
let port = Number(process.env["PORT"]);

if (isNaN(port)) port = 3000;

await app.register(fastifyMultipart);
await app.register(cors);

await app.register(wordsRouter);

const start = async (): Promise<void> => {
  try {
    await app.listen({ host: "0.0.0.0", port });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

await start();
