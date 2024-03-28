import React from "react";
import { Link } from "react-router-dom";

//assets
import { getFullDay } from "../assets/Date";

const AboutUser = ({ bio, social_links, joinedAt, className }) => {
  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p className="text-xl leading-7">
        {bio.length ? bio : "Bio is not updated."}
      </p>

      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
        {Object.keys(social_links).map((key) => {
          let link = social_links[key];

          return link ? (
            <Link to={link} key={key} target={"_blank"}>
              <i
                className={
                  "fi " +
                  (key !== "website" ? "fi-brands-" + key : "fi-sr-site-alt") +
                  "text-2xl hover:text-black"
                }
              ></i>
            </Link>
          ) : (
            ""
          );
        })}
      </div>

      <p className="text-xl leading-7 text-dark-grey">
        Joined on {getFullDay(joinedAt)}
      </p>
    </div>
  );
};

export default AboutUser;
