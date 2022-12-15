import type { CorpusWord } from "../../types/dataTypes";

const getRareWords = async (words: string[]): Promise<CorpusWord[]> => {
  const URL = "https://readvocab-api.up.railway.app/rareWords";
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(words),
  });
  const data = await response.json();
  return data;
};
export default getRareWords;
