import { Router } from "express";

const wordsRouter = Router();

wordsRouter.get("/", (_req, res) => {
  res.send("This is the word route.");
});

export default wordsRouter;
