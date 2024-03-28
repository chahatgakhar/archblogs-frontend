import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

//images
import logo from "../images/logo.png";
import logo_dark from "../images/logo_dark.png";
import toggle from "../images/toggle.png";
import toggle_dark from "../images/toggle_dark.png";

//context
import { useContext } from "react";
import { ThemeContext, UserContext } from "../App";

//components
import UserNavigation from "./UserNavigation";

//assets
import { storeInSession } from "../assets/Sessions";

//middleware
import axios from "axios";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavBox, setUserNavBox] = useState(false);
  //const [searchValue, setSearchValue] = useState("");
  let navigate = useNavigate();

  const {
    userAuth,
    userAuth: { access_token, profile_img, new_notification_available },
    setUserAuth,
  } = useContext(UserContext);

  let { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (access_token) {
      axios
        .get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [access_token]);

  const handleNavBox = () => {
    setUserNavBox((currentVal) => !currentVal);
  };

  const handleNavBoxOnBlur = () => {
    setTimeout(() => {
      setUserNavBox(false);
    }, 300);
  };

  const handleSearchOnKeyDown = (e) => {
    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {
      navigate(`/search/${query}`);
      setSearchBoxVisibility(false);
      //setSearchValue("");
    }
  };

  const changeTheme = () => {
    let newTheme = theme == "light" ? "dark" : "light";

    setTheme(newTheme);

    document.body.setAttribute("data-theme", newTheme);

    storeInSession("theme", newTheme);
  };

  return (
    <>
      <nav className="navbar z-50">
        <Link
          to="/"
          className="flex-none w-16
        "
        >
          <img
            src={theme == "light" ? logo : logo_dark}
            className="w-full bg-white"
          />
        </Link>

        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-14"
            onKeyDown={handleSearchOnKeyDown}
          />

          <i className="fi fi-br-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <i className="fi fi-br-search text-xl"></i>
          </button>
          <Link
            to="/editor"
            className={
              "hidden md:flex text-xl gap-2 link " +
              (theme == "light" ? "text-black" : "text-gray-200")
            }
          >
            <i className="fi fi-sr-file-edit"></i>
            <p>Write</p>
          </Link>
          <button className="w-20" onClick={changeTheme}>
            {theme == "light" ? (
              <img src={toggle} />
            ) : (
              <img src={toggle_dark} />
            )}
          </button>
          {access_token ? (
            <>
              <Link to="/dashboard/notifications">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bgblack/10">
                  <i className="fi fi-ss-bell text-2xl block mt-2"></i>
                  {new_notification_available ? (
                    <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-1.5 right-2.5"></span>
                  ) : (
                    ""
                  )}
                </button>
              </Link>

              <div
                className="relative"
                onClick={handleNavBox}
                onBlur={handleNavBoxOnBlur}
              >
                <button className="w-12 h-12 mt-2">
                  <img
                    src={profile_img}
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>

                {userNavBox ? <UserNavigation /> : ""}
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-dark py-2">
                Sign In
              </Link>

              <Link to="/signup" className="btn-light py-2 hidden md:block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;

// md:w-auto removed from className of input
