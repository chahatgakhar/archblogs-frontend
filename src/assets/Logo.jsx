import React from "react";

//images
import archblogs from "../images/archblogs.png";
import archblogs_dark from "../images/archblogs_dark.png";

//contexts
import { useContext } from "react";
import { ThemeContext } from "../App";

const Logo = () => {
  let { theme, setTheme } = useContext(ThemeContext);
  return (
    <div className="mt-auto flex gap-3">
      <img
        src={theme == "light" ? archblogs : archblogs_dark}
        className="h-36 object-contain block mx-auto select-none "
      />
    </div>
  );
};

export default Logo;
