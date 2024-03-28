import React, { useContext } from "react";
import { Link } from "react-router-dom";

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

const DraftBlogsCardManager = ({ blog }) => {
  let { index, des, title, blog_id } = blog;

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  index++;
  return (
    <>
      <div className="flex gap-5 lg:gap-10 pb-6 border-grey">
        <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
          {index < 10 ? "0" + index : index}
        </h1>

        <div>
          <h1 className="blog-title mb-3">{title}</h1>
          <p className="line-clamp-2 font-gelasio">
            {des.length ? des : "No Description"}
          </p>

          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2 text-gray-400">
              Edit
            </Link>

            <button
              className="pr-4 pt-2 pb-1 text-red"
              onClick={(e) => deleteBlog(blog, access_token, e.target)}
            >
              <i className="fi fi-ss-trash pointer-events-none text-red"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DraftBlogsCardManager;
