import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../config/axiosInstance";

const Login = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const username = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);

  function notify(message: string) {
    toast(message);
  }

  function toggleSignInForm() {
    navigate("/register");
  }

  const handleButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      username: username.current?.value,
      password: password.current?.value,
    };

    if (!userData.username || !userData.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axiosInstance.post("signin", userData);
      notify(response.data.message || "Successfully signed in");

      const token = response.data.token;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["authorization"] = token;

      navigate("/");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An error occurred. Please try again.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-full h-full flex flex-row items-center justify-evenly max-w-7xl">
        <form
          className="w-5/12 bg-black text-white flex flex-col justify-center items-center py-12 rounded-lg bg-opacity-70"
          onSubmit={handleButtonClick}
        >
          <h1 className="font-bold text-3xl py-4 px-2">Sign In</h1>
          <input
            type="text"
            placeholder="Username *"
            className="px-2 py-3 my-3 w-[90%] bg-gray-700"
            ref={username}
          />
          <input
            type="password"
            placeholder="Password *"
            className="px-2 py-3 my-3 w-[90%] bg-gray-700"
            ref={password}
          />
          <p className="text-red-500 font-bold w-[90%]">{errorMessage}</p>
          <button className="p-4 my-6 bg-red-800 w-[90%] rounded" type="submit">
            Sign In
          </button>
          <p
            className="py-6 font-sans text-right text-white font-semibold cursor-pointer"
            onClick={toggleSignInForm}
          >
            New to Platform? Sign Up Now.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
