import React, { useContext } from "react";

//context
import { EditorContext } from "../pages/Editor";

const Tag = ({ tag, tagIndex }) => {
  let {
    blog: { tags },
    blog,
    setBlog,
  } = useContext(EditorContext);

  const handleTagDelete = () => {
    tags = tags.filter((t) => t !== tag);

    setBlog({ ...blog, tags });
  };

  const handleTagEdit = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      let currentTag = e.target.innerText;
      tags[tagIndex] = currentTag;

      setBlog({ ...blog, tags });
      e.target.setAttribute("contentEditable", false);
    }
  };

  const addEdditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <p
        className="outline-none"
        onKeyDown={handleTagEdit}
        onClick={addEdditable}
      >
        {tag}
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleTagDelete}
      >
        <i className="fi fi-ss-cross-circle text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;
