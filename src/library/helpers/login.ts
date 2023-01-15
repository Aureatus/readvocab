import type { Dispatch, SetStateAction } from "react";
import postLogin from "./network/postLogin";

const login = async (
  email: string,
  password: string,
  setEmailError: Dispatch<SetStateAction<Error | null>>,
  setPasswordError: Dispatch<SetStateAction<Error | null>>,
  setUser: Dispatch<SetStateAction<string | null>>
) => {
  try {
    setEmailError(null);
    setPasswordError(null);
    const jwt = await postLogin(email, password);
    setUser(jwt);
  } catch (err) {
    if (!(err instanceof Error)) return;
    if (err.message === "Account with email doesn't exist.") setEmailError(err);
    if (err.message === "Incorrect password.") setPasswordError(err);
    else throw err;
  }
};

export default login;
