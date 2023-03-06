import { useContext } from "react";
import SavedWordsContext from "../../context/SavedWordsContext";

const useSavedWordsContext = () => {
  const context = useContext(SavedWordsContext);
  if (context === undefined)
    throw Error("SavedWordsContext must be used with a context provider!");

  return context;
};

export default useSavedWordsContext;
