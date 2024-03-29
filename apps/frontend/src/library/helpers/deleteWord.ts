import Toast from "react-native-root-toast";
import postDeleteWord from "./network/postDeleteWord";

import type { Dispatch, SetStateAction } from "react";
import type { DefinitionWord } from "../../types/dataTypes";

const deleteWord = async (
  user: string | null,
  word: DefinitionWord,
  savedWords: DefinitionWord[],
  setSavedWords: Dispatch<SetStateAction<DefinitionWord[]>>
) => {
  try {
    if (user === null)
      return Toast.show("Please log in to delete words!", {
        position: Toast.positions.TOP,
      });
    await postDeleteWord(user, word);
    const deletedWordIndex = savedWords.findIndex(
      (element) => JSON.stringify(element) === JSON.stringify(word)
    );
    const newSavedWords = [...savedWords];
    newSavedWords.splice(deletedWordIndex, 1);
    setSavedWords(newSavedWords);
  } catch (err) {
    if (!(err instanceof Error)) return;
    Toast.show(err.message, { position: Toast.positions.TOP });
  }
};

export default deleteWord;
