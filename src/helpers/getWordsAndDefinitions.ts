interface WordObject {
  word: string;
  PoS: string;
  freq: string;
}

interface DefinitionObject {
  word: string;
  PoS: string;
  definition: string;
}

const getWordsAndDefinitions = (
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

export default getWordsAndDefinitions;
