import type { FastifyReply, FastifyRequest } from "fastify";

const getWords = async (
  _request: FastifyRequest,
  _reply: FastifyReply
): Promise<string> => {
  return "This is a get request on the word route";
};

export { getWords };
