import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";

//images
import logo from "../images/logo.png";
import logo_dark from "../images/logo_dark.png";
import banner1 from "../images/banner1.png";
import banner1_dark from "../images/banner1_dark.png";

//assets
import AnimationWrapper from "../assets/PageAnimation";
import uploadImage from "../assets/aws";
import { Toaster, toast } from "react-hot-toast";

//pages
import { EditorContext } from "../pages/Editor.jsx";

//components
import { tools } from "../components/Tools.jsx";

//middleware
import axios from "axios";

//context
import { ThemeContext, UserContext } from "../App.jsx";

const ArchblogEditor = () => {
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    setEditState,
    textEditor,
    setTextEditor,
  } = useContext(EditorContext);

  let { theme, setTheme } = useContext(ThemeContext);

  //let { userAuth } = useContext(UserContext);
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let { blog_id } = useParams();

  let navigate = useNavigate();

  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holder: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "Let's Write an Blog!",
        })
      );
    }
  }, []);

  const handleBlogBannerUpload = (e) => {
    let img = e.target.files[0];

    if (img) {
      let loadingToast = toast.loading("Uploading...");
      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded");
            //blogBannerRef.current.src = url;

            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err);
        });
    }
  };

  const handleTitleKeyDown = (e) => {
    //on pressing of enter reject new line
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handleImgError = (e) => {
    let img = e.target;
    img.src = theme == "light" ? banner1 : banner1_dark;
  };

  const handlePublishButton = (e) => {
    if (!banner.length) {
      return toast.error("Upload a blog banner to publish your blog.");
    }

    if (!title.length) {
      return toast.error("Write blog title to publish your blog");
    }

    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditState("publish");
          } else {
            return toast.error("Create a blog here to publish it.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSaveDraftButton = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("Please provide a title before saving it as a draft");
    }

    let loadingToast = toast.loading("Saving to Drafts...");

    e.target.classList.add("disable");

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObject = {
          title,
          banner,
          des,
          content,
          tags,
          draft: true,
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
            toast.success("Saved to Drafts");

            setTimeout(() => {
              navigate("/dashboard/blogs?tab=draft");
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);

            return toast.error(response.data.error);
          });
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-16">
          <img src={theme == "light" ? logo : logo_dark} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-2 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-5 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishButton}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraftButton}>
            Save Draft
          </button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" onError={handleImgError} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBlogBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default ArchblogEditor;
