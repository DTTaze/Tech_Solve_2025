import { createContext, useState } from "react";
export const AuthContext =  createContext({
  isAuthenticated: false,
  user: {
    email: "",
    username: "",
  },
});
export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      email: "",
      username: "",
    },
  });
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
