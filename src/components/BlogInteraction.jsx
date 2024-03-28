import React, { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";

//context
import { BlogContext } from "../pages/BlogPage";
import { UserContext } from "../App";

//middleware
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikedByUser,
    setLikedByUser,
    setCommentsWrapper,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  useEffect(() => {
    if (access_token) {
      //get likes information from server
      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user",
          { _id },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(({ data: { result } }) => {
          setLikedByUser(Boolean(result));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleLikes = () => {
    if (access_token) {
      //Like the blog
      setLikedByUser((currentVal) => !currentVal);

      !isLikedByUser ? total_likes++ : total_likes--;

      setBlog({ ...blog, activity: { ...activity, total_likes } });

      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/like-blog",
          {
            _id,
            isLikedByUser,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //User not logged in
      toast.error("Please login to like this blog");
    }
  };

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            className={
              "w-10 h-10 rounded-full flex items-center justify-center " +
              (isLikedByUser ? " bg-grey/80 text-red" : "bg-grey/80")
            }
            onClick={handleLikes}
          >
            <i
              className={
                "fi " +
                (isLikedByUser ? "fi-ss-heart w-14" : "fi-rs-heart w-14")
              }
            ></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>
          <p> </p>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
            onClick={() => setCommentsWrapper((currentVal) => !currentVal)}
          >
            <i className="fi fi-ss-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username == author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="text-gray-400 hover:text-purple"
            >
              Edit
            </Link>
          ) : (
            ""
          )}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter-alt text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
