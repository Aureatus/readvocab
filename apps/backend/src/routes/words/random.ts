import { Db } from "mongodb";
import type { FastifyInstance } from "fastify";
import getRandomResult from "../../helpers/getRandomResult.js";

const random = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get("/random", async function randomWords(_request, reply) {
    const { db } = this.mongo;
    // ONLY SEND LOADING STATE UPDATE IF TIME ELAPSED FROM LAST LOADING STATE HAS BEEN GREATER THAN 150MS.
    reply.sse(
      (async function* wordSSEGenerator() {
        try {
          let lastLoadingEventTime = Date.now();

          yield { event: "loading", data: "Processing PDF" };
          if (Date.now() - lastLoadingEventTime >= 150) {
            yield { event: "loading", data: "Searching for cached result." };
            lastLoadingEventTime = Date.now();
          }

          const cachedResult =
            db instanceof Db ? await getRandomResult(db) : null;
          if (cachedResult !== null) {
            yield { event: "result", data: JSON.stringify(cachedResult) };
            return;
          }
        } catch (err) {
          yield {
            event: "error",
            data: err instanceof Error ? err.message : "Unknown Error.",
          };
        }
      })()
    );
  });
};

export default random;
