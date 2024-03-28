import React, { useEffect, useState } from "react";

//assets
import AnimationWrapper from "../assets/PageAnimation";

//components
import InPageNav from "../components/InPageNav.jsx";
import Loader from "../components/Loader.jsx";
import BlogCards from "../components/BlogCards.jsx";
import NoBannerBlogCards from "../components/NoBannerBlogCards.jsx";
import { activeTab, activeTabLine } from "../components/InPageNav.jsx";
import NoDataMessage from "../components/NoDataMessage.jsx";
import { LoadMoreDataButton } from "../components/LoadMoreDataButton.jsx";

//middleware
import axios from "axios";

//assets
import { FilterPagination } from "../assets/FilterPagination.jsx";

const Home = () => {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");
  let categories = [
    "science",
    "technology",
    "marketing",
    "construction",
    "celebration",
    "drawing",
    "education",
    "skills",
    "curriculum",
  ];
  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(async ({ data }) => {
        let formatedData = await FilterPagination({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });

        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await FilterPagination({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          dataToSend: { tag: pageState },
        });

        setBlogs(formatedData);
        //console.log(blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlogs(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  useEffect(() => {
    activeTab.current.click();

    if (pageState == "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchByCategory({ page: 1 });
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/*Latest Blogs*/}
        <div className="w-full">
          <InPageNav
            routes={[pageState, "trending blogs"]}
            defHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogCards
                        content={blog}
                        author={blog.author.personal_info}
                        profile_img={blog.author.personal_info.profile_img}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No Blogs Published" />
              )}

              <LoadMoreDataButton
                state={blogs}
                fetchData={
                  pageState == "home" ? fetchLatestBlogs : fetchByCategory
                }
              />
            </>
            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <NoBannerBlogCards blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No trending Blogs" />
            )}
          </InPageNav>
        </div>

        {/*Filters and Trending Blogs*/}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10 mb-5">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>

              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadByCategory}
                      className={
                        "tag " +
                        (pageState == category ? " bg-black text-white " : " ")
                      }
                      key={i}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-medium text-xl mb-8">
              Trending <i className="fi fi-sr-arrow-trend-up"></i>
            </h1>

            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <NoBannerBlogCards blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No trending Blogs" />
            )}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
