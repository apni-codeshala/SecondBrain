import { createContext } from "react";

export interface IUser {
  token: string;
  username: string;
  email: string;
  share: boolean;
}

interface IUserContext {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}

const UserContext = createContext<IUserContext>({
  user: {
    token: "",
    username: "",
    email: "",
    share: false,
  },
  setUser: () => {},
});

export default UserContext;
