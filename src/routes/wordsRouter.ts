import { Router } from "express";
import { getWords } from "../controllers/words.js";

const wordsRouter = Router();

wordsRouter.get("/", getWords);

export default wordsRouter;
