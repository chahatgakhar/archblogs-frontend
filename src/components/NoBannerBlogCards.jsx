import React from "react";
import { Link } from "react-router-dom";

//assets
import { getDay } from "../assets/Date";

const NoBannerBlogCards = ({ blog, index }) => {
  let {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;
  return (
    <Link
      to={`/blog/${id}`}
      className="flex gap-5 mb-4 border-2 bg-grey border-grey p-3 rounded-lg"
    >
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>

      <div>
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1 text-xl">{fullname} </p>
          <p className=" text-gray-400 md:hidden lg:block">@{username}</p>
          <p className="min-w-fit  text-gray-400">{getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
};

export default NoBannerBlogCards;
