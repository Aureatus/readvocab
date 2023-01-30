import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Db } from "mongodb";

import getRandomResult from "../helpers/getRandomResult.js";

async function randomWords(
  this: FastifyInstance,
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
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
}

export default randomWords;
