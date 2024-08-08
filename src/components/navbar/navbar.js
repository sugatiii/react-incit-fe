import React, { useState } from "react";
import "./navbar.css";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Auth from "../../hooks/auth";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { logOut, getUser, http } = Auth();
  const user = getUser();
  const navigate = useNavigate()
  const [Menu, setMenu] = useState(false);
  const handleMenu = () => {
    setMenu(!Menu);
  };
  const getLogout = () => {
    http
      .get(`/user/logout`)
      .then(function (res) {
        logOut();
      })
      .catch(function (err) {
        console.log("DB Error -> " + err);
        return err;
      });
  };

  const logOutUser = () => {
    getLogout();
  };

  return (
    <div>
      <div className="header-nav bg-slate-100 rounded-md mx-1 md:mx-3">
        <h1 className="logo cursor-pointer"
          onClick={() => {
            navigate('/dashboard')
          }}
        >
          INCIT
          <span className="logo2"> APP</span>
        </h1>

        <div className="profile">
          <div className="dropdown-new">
            <img
              src="./img/Raisa.jpg"
              width={100}
              height={100}
              className="size-img-nav m-5"
              alt="Avatar"
            />

            <div className="dropdown-content-new pt-3">
              <div className="cursor-pointer text-blue-500 hover:text-blue-400 text-right truncate mb-2"
                onClick={() => {
                  navigate('/profile')
                }}
              >
                {user?.name}
              </div>
              <p className="cursor-pointer text-right" onClick={logOutUser}>
                Log Out
              </p>
            </div>
          </div>
        </div>
        <div className="items-center md:hidden">
          {Menu ? (
            <AiOutlineClose size={20} onClick={handleMenu} />
          ) : (
            <AiOutlineMenu size={20} onClick={handleMenu} />
          )}
        </div>
        <div className={Menu ? "left-nav z-50" : "left-nav1 z-50"}>
          <div className="nav-select flex flex-col">
            <img
              src="./img/Raisa.jpg"
              width={100}
              height={100}
              // style={{ width: "100px", height: "100px", objectFit: "cover" }}
              className="size-img cursor-pointer m-5"
              alt="Avatar"
            />
            <div className="cursor-pointer"
              onClick={() => {
                navigate('/profile')
              }}
            >
              <p className="truncate">{user?.name}</p>
            </div>
          </div>
          <ul className="space-left-nav">
            <li className="navbar-left">Home</li>
            <li className="navbar-left">About</li>
            <li className="navbar-left">
              <p className="cursor-pointer" onClick={logOutUser}>
                Log Out
              </p>
            </li>
            {/* <li className="navbar-left">STORIES</li>
              <li className="navbar-left">ANIME</li>
              <li className="navbar-left">DONGHUA</li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
