import postLogin from "./network/postLogin";

import type { Dispatch, SetStateAction } from "react";

const login = async (
  email: string,
  password: string,
  setEmailError: Dispatch<SetStateAction<Error | null>>,
  setPasswordError: Dispatch<SetStateAction<Error | null>>,
  setOtherError: Dispatch<SetStateAction<Error | null>>,
  setUser: Dispatch<SetStateAction<string | null>>,
  goBack: () => void
) => {
  try {
    setEmailError(null);
    setPasswordError(null);
    const jwt = await postLogin(email, password);
    setUser(jwt);
    goBack();
  } catch (err) {
    if (!(err instanceof Error)) return;
    if (err.message === "Account with email doesn't exist.")
      return setEmailError(err);
    if (err.message === "Incorrect password.") return setPasswordError(err);
    else return setOtherError(err);
  }
};

export default login;
