import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";

const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw Error("ThemeContext must be used with a context provider!");

  return context;
};

export default useThemeContext;
