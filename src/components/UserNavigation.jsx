import React, { useContext } from "react";
import { Link } from "react-router-dom";

//context
import { UserContext } from "../App";

//assets
import { removeFromSession } from "../assets/Sessions";
import AnimationWrapper from "../assets/PageAnimation";

const UserNavigation = () => {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);

  const signoutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };
  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-0 z-50"
    >
      <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
        <Link to="/editor" className="flex gap-3 link md:hidden pl-8 py-4">
          <p>Write</p>
          <i className="fi fi-sr-file-edit"></i>
        </Link>

        <Link to={`/user/${username}`} className="link pl-8 py-4">
          <p>Profile</p>
        </Link>

        <Link to="/dashboard/blogs" className="link pl-8 py-4">
          <p>Dashboard</p>
        </Link>

        <Link to="settings/edit-profile" className="link pl-8 py-4">
          <p>Settings</p>
        </Link>

        <span className="absolute border-t border-grey w-[100%]"></span>

        <button
          className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
          onClick={signoutUser}
        >
          <h1 className="font-bold text-xl mg-2">Sign Out</h1>
          <p className="text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigation;
