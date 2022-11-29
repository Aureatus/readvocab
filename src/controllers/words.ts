import type { Request, Response } from "express";

const getWords = (_req: Request, res: Response): Response => {
  return res.send("This is a get request on the word route.");
};

export { getWords };
