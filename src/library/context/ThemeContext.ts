import { createContext, Dispatch, SetStateAction } from "react";

const ThemeContext = createContext<
  | {
      theme: "light" | "dark";
      setTheme: Dispatch<SetStateAction<"light" | "dark">>;
    }
  | undefined
>(undefined);

export default ThemeContext;
