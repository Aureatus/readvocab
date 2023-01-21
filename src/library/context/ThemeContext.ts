import { createContext } from "react";

const ThemeContext = createContext<
  | {
      isThemeDark: boolean;
      toggleTheme: () => void;
    }
  | undefined
>(undefined);

export default ThemeContext;
