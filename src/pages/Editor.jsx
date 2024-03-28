import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

//context
import { UserContext } from "../App";

//components
import ArchblogEditor from "../components/ArchblogEditor.jsx";
import PublishForm from "../components/PublishForm.jsx";
import Loader from "../components/Loader.jsx";

//middleware
import axios from "axios";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editState, setEditState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
        blog_id,
        draft: true,
        mode: "edit",
      })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        setLoading(false);
      })
      .catch((err) => {
        setBlog(null);
        setLoading(false);
      });
  }, []);
  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editState,
        setEditState,
        textEditor,
        setTextEditor,
      }}
    >
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : loading ? (
        <Loader />
      ) : editState == "editor" ? (
        <h1>
          <ArchblogEditor />
        </h1>
      ) : (
        <h1>
          <PublishForm />
        </h1>
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
