import removeDuplicates from "../utils/removeDuplicates.js";

import type { CorpusWord } from "../types.js";

const findRareWords = (
  wordList: string[],
  numberOfWords: number,
  corpus: any
): CorpusWord[] => {
  const uniqueWords = removeDuplicates(wordList);
  const rareWordObjects = corpus.getMatchedWords(uniqueWords, numberOfWords);
  return rareWordObjects;
};

export default findRareWords;
