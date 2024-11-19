import React, { ReactNode, useState } from "react";
import UserContext, { IUser } from "./UserContext";

interface IUserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<IUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser>({
    token: "",
    username: "",
    email: "",
    share: false,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
