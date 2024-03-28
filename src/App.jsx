import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { createContext } from "react";

//assets
import { lookupInSession } from "./assets/Sessions.jsx";

//components
import SideNav from "./components/SideNav.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import BlogManager from "./components/BlogManager.jsx";

import SearchPage from "./components/SearchPage.jsx";

//pages
import EditProfilePage from "./pages/EditProfilePage.jsx";
import Notifications from "./pages/Notifications.jsx";
import Editor from "./pages/Editor.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import UserAuthForm from "./pages/UserAuthForm.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";

//export context
export const UserContext = createContext({});

export const ThemeContext = createContext({});

const darkThemePreference = () =>
  window.matchMedia("(prefers-colors-scheme: dark").matches;

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  const [theme, setTheme] = useState(() =>
    darkThemePreference() ? "dark" : "light"
  );

  useEffect(() => {
    let userLoggedInSession = lookupInSession("user");
    let themeInSession = lookupInSession("theme");

    userLoggedInSession
      ? setUserAuth(JSON.parse(userLoggedInSession))
      : setUserAuth({ access_token: null });

    if (themeInSession) {
      setTheme(() => {
        document.body.setAttribute("data-theme", themeInSession);
        return themeInSession;
      });
    }

    document.body.setAttribute("data-theme", theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:blog_id" element={<Editor />} />
          <Route path="/" element={<Navbar />}>
            <Route path="/" element={<Home />} />
            <Route path="dashboard" element={<SideNav />}>
              <Route path="blogs" element={<BlogManager />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
            <Route path="settings" element={<SideNav />}>
              <Route path="edit-profile" element={<EditProfilePage />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route path="signin" element={<UserAuthForm type="sign-in" />} />
            <Route path="signup" element={<UserAuthForm type="sign-up" />} />
            <Route path="search/:query" element={<SearchPage />} />
            <Route path="user/:id" element={<UserProfilePage />} />
            <Route path="blog/:blog_id" element={<BlogPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
