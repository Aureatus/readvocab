import removeDuplicates from "../utils/removeDuplicates.js";

import type { corpusInstance, CorpusWord } from "../types.js";

const findRareWords = (
  wordList: string[],
  numberOfWords: number,
  corpus: corpusInstance
): CorpusWord[] => {
  const uniqueWords = removeDuplicates(wordList);
  const rareWordObjects = corpus.getMatchedWords(uniqueWords, numberOfWords);
  return rareWordObjects;
};

export default findRareWords;
