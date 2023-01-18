import type { Dispatch, SetStateAction } from "react";
import Toast from "react-native-root-toast";
import type { DefinitionWord } from "../../types/dataTypes";
import postDeleteWord from "./network/postDeleteWord";

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
    newSavedWords.splice(deletedWordIndex);
    setSavedWords(newSavedWords);
  } catch (err) {
    if (!(err instanceof Error)) return;
    Toast.show(err.message, { position: Toast.positions.TOP });
  }
};

export default deleteWord;
