import { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";

import displayError from "../helpers/displayError";

const useHandledLoginData = () => {
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<Error | null>(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<Error | null>(null);

  const [otherError, setOtherError] = useState<Error | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (otherError instanceof Error) displayError(colors, otherError);
  }, [colors, otherError]);

  return {
    email,
    setEmail,
    emailError,
    setEmailError,
    password,
    setPassword,
    passwordError,
    setPasswordError,
    otherError,
    setOtherError,
    loading,
    setLoading,
  };
};

export default useHandledLoginData;
