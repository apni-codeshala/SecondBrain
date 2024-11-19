import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../config/axiosInstance"; // Ensure axiosInstance is properly set up
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const username = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const email = useRef<HTMLInputElement | null>(null);

  function toggleSignInForm() {
    navigate("/login");
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      username: username.current?.value,
      email: email.current?.value,
      password: password.current?.value,
    };

    try {
      const response = await axiosInstance.post("signup", userData);
      console.log(response);
      toast("Successfully registered!");
      navigate("/login");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-full h-full flex flex-row items-center justify-evenly max-w-7xl">
        <form
          className="w-5/12 bg-black text-white flex flex-col justify-center items-center py-12 rounded-lg bg-opacity-70"
          onSubmit={handleRegister}
        >
          <h1 className="font-bold text-3xl py-4 px-2">Register</h1>
          <input
            type="text"
            placeholder="Username *"
            className="px-2 py-3 my-3 w-[90%] bg-gray-700"
            ref={username}
          />
          <input
            type="email"
            placeholder="Email *"
            className="px-2 py-3 my-3 w-[90%] bg-gray-700"
            ref={email}
          />
          <input
            type="password"
            placeholder="Password *"
            className="px-2 py-3 my-3 w-[90%] bg-gray-700"
            ref={password}
          />
          <p className="text-red-500 font-bold w-[90%]">{errorMessage}</p>
          <button className="p-4 my-6 bg-red-800 w-[90%] rounded" type="submit">
            Register
          </button>
          <p
            className="py-6 font-sans text-right text-white font-semibold cursor-pointer"
            onClick={toggleSignInForm}
          >
            Already Registered? Sign In Now.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
