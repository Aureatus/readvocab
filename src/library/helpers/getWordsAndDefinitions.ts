import type { CorpusWord, DefinitionWord } from "../../types/dataTypes";

const getWordsAndDefinitions = async (
  words: CorpusWord[]
): Promise<DefinitionWord[]> => {
  const URL = "https://readvocab-api.up.railway.app/wordsAndDefinitions";
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(words),
  });
  const data = await response.json();
  return data;
};
export default getWordsAndDefinitions;
