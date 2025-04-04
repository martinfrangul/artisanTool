import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useIsAdmin = () => {
  const { user } = useContext(AuthContext);
  return user?.admin === true;
};

export default useIsAdmin;
