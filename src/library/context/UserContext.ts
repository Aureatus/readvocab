import { createContext, Dispatch, SetStateAction } from "react";

const UserContext = createContext<{
  user: string | null;
  setUser: Dispatch<SetStateAction<string | null>>;
} | null>(null);

export default UserContext;
