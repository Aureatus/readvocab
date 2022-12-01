import { corpusObject } from "corpus-word-freq";
import removeDuplicates from "../utils/removeDuplicates.js";

import type { WordObject } from "../types.js";

const findRareWords = (
  wordList: string[],
  numberOfWords: number
): WordObject[] => {
  const corpus = corpusObject([
    "Prep",
    "Neg",
    "Num",
    "NoP",
    "NoP-",
    "Lett",
    "Int",
    "Inf",
    "Conj",
    "Pron",
    "Det",
    "DetP",
    "Gen",
    "Ex",
    "Uncl",
    "Fore",
  ]);

  const uniqueWords = removeDuplicates(wordList);
  const rareWordObjects = corpus.getMatchedWords(uniqueWords, numberOfWords);
  return rareWordObjects;
};

export default findRareWords;
