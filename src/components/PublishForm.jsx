import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";

//assets
import AnimationWrapper from "../assets/PageAnimation";

//pages
import { EditorContext } from "../pages/Editor";

//context
import { UserContext } from "../App.jsx";

//components
import Tag from "../components/Tag.jsx";

//middleware
import axios from "axios";

const PublishForm = () => {
  let {
    blog,
    blog: { banner, title, tags, des, content },
    setBlog,
    setEditState,
  } = useContext(EditorContext);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let navigate = useNavigate();

  let characterLimit = 200;
  let tagLimit = 10;

  let { blog_id } = useParams();

  const handleCloseButton = () => {
    setEditState("editor");
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value });
  };

  const handleDesKeyDown = (e) => {
    //on pressing of enter reject new line
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      let tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add max ${tagLimit}`);
      }

      e.target.value = "";
    }
  };

  const handleDesChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, des: input.value });
  };

  const publishBlog = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("Please provide a title to publish your blog");
    }

    if (!des.length || des.length > 200) {
      return toast.error(
        `Please provide a description about your blog to publish your blog within ${characterLimit}`
      );
    }

    if (!tags.length) {
      return toast.error("Please provide at least 1 tag to publish your blog");
    }

    let loadingToast = toast.loading("Publishing...");

    e.target.classList.add("disable");

    let blogObject = {
      title,
      banner,
      des,
      content,
      tags,
      draft: false,
    };

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/create",
        { ...blogObject, id: blog_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        toast.success("Published");

        setTimeout(() => {
          navigate("/dashboard/blogs");
        }, 500);
      })
      .catch(({ response }) => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);

        return toast.error(response.data.error);
      });
  };

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />

        <button
          className="w-14 h-14 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseButton}
        >
          <i className="fi fi-ss-cross-circle"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-2">Preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} />
          </div>

          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>

          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {des}
          </p>
        </div>

        <div className="border-grey lg:border-2 pl-8 pr-8 pb-4">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={handleTitleChange}
          />

          <p className="text-dark-grey mb-2 mt-9">Overview of your blog</p>

          <textarea
            maxLength={characterLimit}
            defaultValue={des}
            className="h-40 resize-none leading-7 input-box pl-4 "
            onChange={handleDesChange}
            onKeyDown={handleDesKeyDown}
          ></textarea>

          <p className="mt-2 text-dark-grey text-sm text-right">
            {characterLimit - des.length} characters left
          </p>

          <p className="text-dark-grey mb-2 mt-9">
            Topics - ( Helps in searching and ranking your blog )
          </p>

          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Topic"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleTagKeyDown}
            />

            {tags.map((tag, i) => {
              return <Tag tag={tag} tagIndex={i} key={i} />;
            })}
          </div>

          <p className="mt-1 mb-4 text-dark-grey text-right">
            {tagLimit - tags.length} Tags remaining
          </p>

          <button className="btn-dark px-8" onClick={publishBlog}>
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
