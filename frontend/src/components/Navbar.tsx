import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "flowbite-react";
import { HiFolderAdd, HiShare } from "react-icons/hi";

import Logo from "../assets/brain-removebg-preview.png";
import useUser from "../utils/useUser";
import { PopupComponent } from "./PopupContent";
import { SharePopup } from "./SharePopup";
import UserContext from "../utils/UserContext";

export function NavbarComponent() {
  const [contentModal, setContentModal] = useState<boolean>(false);
  const [shareModal, setShareModal] = useState<boolean>(false);
  const user = useUser();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser({
      token: "",
      username: "",
      email: "",
      share: false,
    });
    localStorage.setItem("token", "");
    navigate("/login");
  };

  return (
    <>
      <SharePopup openModal={shareModal} setOpenModal={setShareModal} />
      <PopupComponent
        contentModal={contentModal}
        setContentModal={setContentModal}
      />
      <Navbar fluid rounded className="bg-gray-200">
        <Navbar.Brand as={Link} to="/">
          <img src={Logo} className="mr-1 h-6 sm:h-9" alt="Second Brain Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Second Brain
          </span>
        </Navbar.Brand>
        <Navbar.Collapse>
          <div className="flex md:order-2 gap-2 justify-center items-center">
            {user?.username ? (
              <p className="text-gray-900 px-2 font-medium">
                Welcome, {user.username}
              </p>
            ) : (
              <Link
                className="flex justify-center items-center px-4 py-1 bg-blue-200 gap-2 rounded-md"
                to="/login"
              >
                Login
              </Link>
            )}
            {user.username && (
              <>
                <button
                  className="flex justify-center items-center px-4 py-1 bg-blue-200 gap-2 rounded-md"
                  onClick={() => setShareModal(true)}
                >
                  <HiShare />
                  <p className="text-lg">Share</p>
                </button>
                <button
                  className="flex justify-center items-center px-4 py-1 bg-blue-500 gap-2 rounded-md"
                  onClick={() => setContentModal(true)}
                >
                  <HiFolderAdd />
                  <p className="text-lg">Add Content</p>
                </button>
                <button
                  className="flex justify-center items-center px-4 py-1 bg-red-500 gap-2 rounded-md"
                  onClick={() => handleLogout()}
                >
                  <HiFolderAdd />
                  <p className="text-lg">Logout</p>
                </button>
              </>
            )}
          </div>
        </Navbar.Collapse>
        <Navbar.Toggle />
      </Navbar>
    </>
  );
}
