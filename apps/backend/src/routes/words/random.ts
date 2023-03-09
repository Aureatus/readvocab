import type { FastifyInstance } from "fastify";
import getRandomResult from "../../helpers/getRandomResult.js";

const random = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get("/random", async function randomWords(_request) {
    // ONLY SEND LOADING STATE UPDATE IF TIME ELAPSED FROM LAST LOADING STATE HAS BEEN GREATER THAN 150MS.
    const cachedResult = await getRandomResult();
    if (cachedResult !== null) {
      return cachedResult;
    } else throw Error("Unable to get random PDF");
  });
};

export default random;
