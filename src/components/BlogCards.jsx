import React from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../App";

//assets
import { getDay } from "../assets/Date";
import { useContext } from "react";

const BlogCards = ({ content, author }) => {
  let { theme } = useContext(ThemeContext);
  let {
    publishedAt,
    tags,
    des,
    title,
    banner,
    activity: { total_likes },
    blog_id: id,
  } = content;

  let { fullname, profile_img, username } = author;
  return (
    <>
      <Link
        to={`/blog/${id}`}
        className="flex gap-8 items-center bg-grey border-2 pl-5 pt-3 rounded-lg border-grey pb-5 mb-4 "
      >
        <div className="w-full">
          <div className="flex gap-2 items-center mb-7">
            <img src={profile_img} className="w-6 h-6 rounded-full" />
            <p className="line-clamp-1 text-xl">
              {username}
              <span className="text-gray-400 hidden md:block"> {fullname}</span>
            </p>

            <p className="min-w-fit text-gray-400">{getDay(publishedAt)}</p>
          </div>

          <h1 className="blog-title">{title}</h1>

          <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
            {des}
          </p>

          <div className="flex gap-4 mt-7">
            <span className="btn-dark text-md py-1 px-4">{tags[0]}</span>
            <span className="ml-3 flex items-center gap-3 text-dark-grey">
              <i className="fi fi-ss-heart text-xl"></i>
              {total_likes}
            </span>
          </div>
        </div>

        <div className="h-24 aspect-square bg-grey m-4 md:md-6 md:h-28">
          <img
            src={banner}
            className="w-full h-full aspect-square object-cover rounded-md"
          />
        </div>
      </Link>
    </>
  );
};

export default BlogCards;
