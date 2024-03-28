import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//components
import InPageNav from "../components/InPageNav";
import Loader from "./Loader";
import BlogCards from "./BlogCards";
import NoDataMessage from "./NoDataMessage";
import { LoadMoreDataButton } from "./LoadMoreDataButton";
import UserCard from "./UserCard";

//assets
import AnimationWrapper from "../assets/PageAnimation";
import { FilterPagination } from "../assets/FilterPagination";

//middleware
import axios from "axios";

const SearchPage = () => {
  let { query } = useParams();

  let [blogs, setBlogs] = useState(null);
  let [users, setUsers] = useState(null);

  const searchBlogs = ({ page = 1, createNewArray = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await FilterPagination({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          dataToSend: { query },
          createNewArray,
        });

        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchUsers = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-user", {
        query,
      })
      .then(({ data: { users } }) => {
        setUsers(users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, createNewArray: true });
    searchUsers();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users == null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.05 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No user found" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNav
          routes={[`Search Results for "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
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

            <LoadMoreDataButton state={blogs} fetchData={searchBlogs} />
          </>

          <UserCardWrapper />
        </InPageNav>
      </div>

      <div className="min-w-[40%] lg-min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8 ">
          User related to Search <i className="fi fi-sr-user mt-1"></i>
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
