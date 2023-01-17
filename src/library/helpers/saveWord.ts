import type { Dispatch, SetStateAction } from "react";
import Toast from "react-native-root-toast";
import type { DefinitionWord } from "../../types/dataTypes";
import postSaveWord from "./network/postSaveWord";

const saveWord = async (
  user: string | null,
  word: DefinitionWord,
  savedWords: DefinitionWord[],
  setSavedWords: Dispatch<SetStateAction<DefinitionWord[]>>
) => {
  try {
    if (user === null)
      return Toast.show("Please log in to save words!", {
        position: Toast.positions.TOP,
      });
    await postSaveWord(user, word);
    setSavedWords([...savedWords, word]);
  } catch (err) {
    if (!(err instanceof Error)) return;
    Toast.show(err.message, { position: Toast.positions.TOP });
  }
};

export default saveWord;
