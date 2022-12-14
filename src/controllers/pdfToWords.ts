import wordsFromPDF from "../helpers/wordsFromPDF.js";

import type { FastifyReply, FastifyRequest } from "fastify";

const pdfToWords = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<string[]> => {
  const files = await request.saveRequestFiles();
  const filePath = files[0]?.filepath;
  const fileExtension = files[0]?.mimetype;
  if (filePath === undefined) throw Error("File not found");
  if (fileExtension !== "application/pdf") throw Error("Please upload a PDF.");
  const words = await wordsFromPDF(filePath);

  return words;
};

export { pdfToWords };
