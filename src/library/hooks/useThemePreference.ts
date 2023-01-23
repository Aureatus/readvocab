import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const useThemePreference = () => {
  const [isThemeDark, setIsThemeDark] = useState(true);

  useEffect(() => {
    (async () => {
      const themePreference = await AsyncStorage.getItem("themePreference");
      setIsThemeDark(themePreference === "dark" ? true : false);
    })();
  }, []);

  return { isThemeDark, setIsThemeDark };
};

export default useThemePreference;
