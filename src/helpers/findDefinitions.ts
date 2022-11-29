/* eslint-disable @typescript-eslint/return-await */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WordPOS = require("wordpos");

interface WordObject {
  word: string;
  PoS: string;
  freq: string;
}

const findDefinitions = async (
  wordList: WordObject[]
): Promise<Array<string | null | undefined>> => {
  const wordSearch = new WordPOS();
  const definitions = await Promise.all(
    wordList.map(async (wordObject) => {
      const getWordInfo = async (): Promise<Array<{ def: string }>> => {
        switch (wordObject.PoS) {
          case "Verb":
            return await wordSearch.lookupVerb(wordObject.word);
          case "Adj":
            return await wordSearch.lookupAdjective(wordObject.word);
          case "Adv":
            return await wordSearch.lookupAdverb(wordObject.word);
          default:
            return await wordSearch.lookup(wordObject.word);
        }
      };

      const wordInfo = await getWordInfo();
      if (wordInfo.length === 0) return null;

      return wordInfo[0]?.def;
    })
  );
  return definitions;
};

export default findDefinitions;
