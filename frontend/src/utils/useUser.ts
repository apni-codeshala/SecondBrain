import { useContext, useEffect } from "react";
import UserContext from "./UserContext";
import axiosInstance from "../config/axiosInstance";

const useUser = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      axiosInstance.defaults.headers.common["authorization"] = token;
      if (token) {
        try {
          const response = await axiosInstance.get("/verifytoken");
          const { email, username, share } = response.data.data;
          setUser({
            token,
            username,
            email,
            share,
          });
          if (response.data.success) {
          } else {
            setUser({
              token: "",
              username: "",
              email: "",
              share: false,
            });
          }
        } catch (error) {
          console.error("Error verifying the user");
        }
      }
    };

    verifyUser();
  }, []);
  return user;
};

export default useUser;
