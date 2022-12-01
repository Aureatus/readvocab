import type { FastifyReply, FastifyRequest } from "fastify";

const getWords = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<string> => {
  const files = await request.saveRequestFiles();
  const filePath = files[0]?.filepath;
  if (filePath === undefined) throw Error("File not found");

  return "This is a get request on the word route";
};

export { getWords };
