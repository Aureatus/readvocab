import postSignup from "./network/postSignup";

import type { Dispatch, SetStateAction } from "react";

const signup = async (
  email: string,
  password: string,
  confirmPassword: string,
  setEmailError: Dispatch<SetStateAction<Error | null>>,
  setPasswordError: Dispatch<SetStateAction<Error | null>>,
  setConfirmPasswordError: Dispatch<SetStateAction<Error | null>>,
  setOtherError: Dispatch<SetStateAction<Error | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setUser: Dispatch<SetStateAction<string | null>>,
  goBackToNonAuth: () => void
) => {
  try {
    setLoading(true);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setOtherError(null);
    const jwt = await postSignup(email, password, confirmPassword);
    setUser(jwt);
    goBackToNonAuth();
  } catch (err) {
    if (!(err instanceof Error)) return;
    if (err.message === "Account with that email already exists.")
      return setEmailError(err);
    if (err.message === "Password confirmation doesn't match.")
      return setConfirmPasswordError(err);
    else return setOtherError(err);
  } finally {
    setLoading(false);
  }
};

export default signup;
