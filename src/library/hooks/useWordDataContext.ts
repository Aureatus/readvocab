import { useContext } from "react";
import WordDataContext from "../context/WordDataContext";

const useWordDataContext = () => {
  const context = useContext(WordDataContext);
  if (context === null)
    throw Error("WordDataContext must be used with a context provider!");

  return context;
};

export default useWordDataContext;
