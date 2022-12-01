import type { DefinitionObject, WordObject } from "../types.js";

const mergeWordsAndDefs = (
  rareWords: WordObject[],
  rareWordDefinitions: Array<string | null | undefined>
): DefinitionObject[] => {
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
    .filter((e): e is DefinitionObject => e !== null);
};

export default mergeWordsAndDefs;
