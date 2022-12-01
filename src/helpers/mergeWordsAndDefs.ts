import type { CorpusWord, DefinitionWord } from "../types.js";

const mergeWordsAndDefs = (
  rareWords: CorpusWord[],
  rareWordDefinitions: Array<string | null | undefined>
): DefinitionWord[] => {
  return rareWords
    .map((e, index) => {
      const definition = rareWordDefinitions[index];
      if (definition === null) return null;

      const object = {
        word: e.word,
        PoS: e.PoS,
        definition,
      };
      return object;
    })
    .filter((e): e is DefinitionWord => e !== null);
};

export default mergeWordsAndDefs;
