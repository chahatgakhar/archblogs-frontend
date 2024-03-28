import React from "react";
import { Link } from "react-router-dom";

//images
import pageNotFound from "../images/pageNotFound.png";

//assets
import Logo from "../assets/Logo.jsx";

const PageNotFound = () => {
  return (
    <section className="h-cover relative p-1 flex flex-col items-center gap-12 text-center">
      <img
        src={pageNotFound}
        className="select-none w-96 aspect-vedio object-cover rounded"
      />
      <h1 className="text-4xl font-gelasio leading-11">Page not found!</h1>
      <div className="text-dark-grey text-xl leading-11 -mt-8">
        <Link to="/" className="btn-dark text-white ">
          <b>Homepage</b>
        </Link>
        <Logo />
        <p className="text-center mt-2 px-4 py-2 bg-grey rounded-full font-normal">
          Designed by{" "}
          <a
            href="https://www.chahatgakhar.com/"
            target="_blank"
            className="underline"
          >
            Chahat Gakhar
          </a>
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;
