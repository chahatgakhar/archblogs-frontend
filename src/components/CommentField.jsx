import React, { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

//context
import { UserContext } from "../App";

//middleware
import axios from "axios";

//pages
import { BlogContext } from "../pages/BlogPage";

const CommentField = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setReplying,
}) => {
  const [comment, setComment] = useState("");

  let {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      comments: { results: commentsArr },
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBlog,
    setParentCommentsLoaded,
  } = useContext(BlogContext);

  let {
    userAuth: { access_token, username, fullname, profile_img },
  } = useContext(UserContext);

  const handleComment = () => {
    if (!access_token) {
      return toast.error("Please login to leave a comment");
    }

    if (!comment.length) {
      return toast.error("Write something to leave a comment...");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",
        {
          _id,
          blog_author,
          comment,
          replying_to: replyingTo,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setComment("");

        data.commented_by = {
          personal_info: { username, profile_img, fullname },
        };

        let newCommentArray;

        if (replyingTo) {
          commentsArr[index].children.push(data._id);

          data.childrenLevel = commentsArr[index].childrenLevel + 1;

          data.parentIndex = index;

          commentsArr[index].isReplyLoaded = true;

          commentsArr.splice(index + 1, 0, data);

          newCommentArray = commentsArr;

          setReplying(false);
        } else {
          data.childrenLevel = 0;

          newCommentArray = [data, ...commentsArr];
        }

        let parentCommentIncrementValue = replyingTo ? 0 : 1;

        setBlog({
          ...blog,
          comments: { ...comments, results: newCommentArray },
          activity: {
            ...activity,
            total_comments: total_comments + 1,
            total_parent_comments:
              total_parent_comments + parentCommentIncrementValue,
          },
        });

        setParentCommentsLoaded(
          (currentVal) => currentVal + parentCommentIncrementValue
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        {action}
      </button>
    </>
  );
};

export default CommentField;
