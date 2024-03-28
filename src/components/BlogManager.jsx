import React, { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

//middleware
import axios from "axios";

//context
import { UserContext } from "../App";

//assets
import { FilterPagination } from "../assets/FilterPagination";
import AnimationWrapper from "../assets/PageAnimation";

//components
import InPageNav from "./InPageNav";
import Loader from "./Loader";
import NoDataMessage from "./NoDataMessage";
import PublishedBlogsCardsManager from "./PublishedBlogsCardsManager";
import DraftBlogsCardManager from "./DraftBlogsCardManager";
import { LoadMoreDataButton } from "./LoadMoreDataButton";
import { activeTab, activeTabLine } from "./InPageNav.jsx";

const BlogManager = () => {
  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState("");

  let activeTab1 = useSearchParams()[0].get("tab");

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs",
        {
          page,
          draft,
          query,
          deletedDocCount,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(async ({ data }) => {
        let formatedData = await FilterPagination({
          state: drafts ? drafts : blogs,
          data: data.blogs,
          page,
          countRoute: "/user-written-blogs-count",
          dataToSend: { draft, query },
          user: access_token,
        });

        if (draft) {
          setDrafts(formatedData);
        } else {
          setBlogs(formatedData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    activeTab.current.click();
    if (access_token) {
      if (blogs == null) {
        getBlogs({ page: 1, draft: false });
      }
      if (drafts == null) {
        getBlogs({ page: 1, draft: true });
      }
    }
  }, [access_token, blogs, drafts, query]);

  const handleSearch = (e) => {
    let searchQuery = e.target.value;
    setQuery(searchQuery);
    if (e.keyCode == 13 && searchQuery.length) {
      setBlogs(null);
      setDrafts(null);
    }
  };

  const handleChange = (e) => {
    if (!e.target.value.length) {
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  };

  return (
    <>
      <h1 className="max-md:hidden">Manage Blogs</h1>
      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey pl-12 p-4 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="  Search Blogs"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/4 text-xl text-dark-grey"></i>
      </div>

      <InPageNav
        routes={["Published Blogs", "Drafts"]}
        defActiveIndex={activeTab1 !== "draft" ? 0 : 1}
      >
        {
          //published blogs
          blogs == null ? (
            <Loader />
          ) : blogs.results.length ? (
            <>
              {blogs.results.map((blog, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                    <PublishedBlogsCardsManager
                      blog={{ ...blog, index: i, setStateFunc: setBlogs }}
                    />
                  </AnimationWrapper>
                );
              })}

              <LoadMoreDataButton
                state={blogs}
                fetchData={getBlogs}
                additionalParam={{
                  draft: false,
                  deletedDocCount: blogs.deletedDocCount,
                }}
              />
            </>
          ) : (
            <NoDataMessage message="No published blogs" />
          )
        }

        {
          //draft blogs
          drafts == null ? (
            <Loader />
          ) : drafts.results.length ? (
            <>
              {drafts.results.map((blog, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                    <DraftBlogsCardManager
                      blog={{ ...blog, index: i, setStateFunc: setDrafts }}
                    />
                  </AnimationWrapper>
                );
              })}

              <LoadMoreDataButton
                state={drafts}
                fetchData={getBlogs}
                additionalParam={{
                  draft: true,
                  deletedDocCount: drafts.deletedDocCount,
                }}
              />
            </>
          ) : (
            <NoDataMessage message="No published blogs" />
          )
        }

        <h1>These are Draft blogs</h1>
      </InPageNav>
    </>
  );
};

export default BlogManager;
