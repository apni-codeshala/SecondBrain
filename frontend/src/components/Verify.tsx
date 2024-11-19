import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";
import UserContext from "../utils/UserContext";
import { Spinner } from "flowbite-react";

const Verify = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

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
            navigate("/brain");
          } else {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error verifying the user:", error);
          navigate("/login");
        }
      } else {
        navigate("/register");
      }
    };

    verifyUser();
  }, [navigate]);

  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-gray-700">
      <Spinner color="success" aria-label="Success spinner example" size="lg" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Verify;
