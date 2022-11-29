import { Router } from "express";
import { getWords } from "../controllers/words";

const wordsRouter = Router();

wordsRouter.get("/", getWords);

export default wordsRouter;
