import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

//assets
import { getDay } from "../assets/Date";

//components
import BlogStats from "./BlogStats";

//context
import { UserContext } from "../App";

//middleware
import axios from "axios";

const deleteBlog = (blog, access_token, target) => {
  let { index, blog_id, setStateFunc } = blog;

  target.setAttribute("disabled", true);

  axios
    .post(
      import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog",
      {
        blog_id,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    .then(({ data }) => {
      target.removeAttribute("disabled");

      setStateFunc((currentVal) => {
        let { deletedDocCount, totalDocs, results } = currentVal;

        results.splice(index, 1);

        if (!deletedDocCount) {
          deletedDocCount = 0;
        }

        if (!results.length && totalDocs - 1 > 0) {
          return null;
        }

        return {
          ...currentVal,
          totalDocs: totalDocs - 1,
          deletedDocCount: deletedDocCount + 1,
        };
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const PublishedBlogsCardsManager = ({ blog }) => {
  let { banner, publishedAt, title, blog_id, activity } = blog;
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let [showStats, setShowStats] = useState(false);

  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
        <img
          src={banner}
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover"
        />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link
              to={`/blog/${blog_id}`}
              className="blog-title mb-4 hover:underline"
            >
              {title}
            </Link>

            <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
          </div>

          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2 text-gray-400">
              Edit
            </Link>

            <button
              className="lg:hidden pr-4 py-2 text-gray-400"
              onClick={() => setShowStats((currentVal) => !currentVal)}
            >
              Stats
            </button>

            <button
              className="pr-4 pt-2 pb-1 text-red"
              onClick={(e) => deleteBlog(blog, access_token, e.target)}
            >
              <i className="fi fi-ss-trash pointer-events-none text-red"></i>
            </button>
          </div>
        </div>

        <div className="max-lg:hidden">
          <BlogStats stats={activity} />
        </div>
      </div>

      {showStats ? (
        <div className="lg:hidden">
          <BlogStats stats={activity} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default PublishedBlogsCardsManager;
