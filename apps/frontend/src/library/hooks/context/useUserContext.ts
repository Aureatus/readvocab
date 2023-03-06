import { useContext } from "react";
import UserContext from "../../context/UserContext";

const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw Error("UserContext must be used with a context provider!");

  return context;
};

export default useUserContext;
