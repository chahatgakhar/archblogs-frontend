import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

//assets
import AnimationWrapper from "../assets/PageAnimation";
import { FilterPagination } from "../assets/FilterPagination";

//pages
import PageNotFound from "./PageNotFound";

//components
import AboutUser from "../components/AboutUser";
import InPageNav, { activeTab } from "../components/InPageNav";
import BlogCards from "../components/BlogCards";
import NoDataMessage from "../components/NoDataMessage";
import { LoadMoreDataButton } from "../components/LoadMoreDataButton";
import Loader from "../components/Loader";

//context
import { UserContext } from "../App";

//middleware
import axios from "axios";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_blogs: 0,
  },
  social_links: {},
  joinedAt: "",
};

const UserProfilePage = () => {
  let { id: profileId } = useParams();

  let [profile, setProfile] = useState(profileDataStructure);

  let [loading, setLoading] = useState(true);

  let [blogs, setBlogs] = useState(null);

  let [profileLoaded, setProfileLoaded] = useState("");

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  let {
    userAuth: { username },
  } = useContext(UserContext);

  const fetchUserProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
        if (user !== null) {
          setProfile(user);
        }

        setProfileLoaded(profileId);
        getBlogs({ user_id: user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await FilterPagination({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          dataToSend: { author: user_id },
        });

        formatedData.user_id = user_id;

        setBlogs(formatedData);
      });
  };

  useEffect(() => {
    if (profileId == !profileLoaded) {
      setBlogs(null);
    }

    if (blogs == null) {
      resetState();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  const resetState = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("");
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profile_username.length ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
            <img
              src={profile_img}
              className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
            />

            <h1 className="text-2xl font-medium">@{profile_username}</h1>

            <p className="text-xl capitalize h-6">{fullname}</p>

            <p>
              {total_posts.toLocaleString()} Blogs -{" "}
              {total_reads.toLocaleString()} Reads
            </p>

            <div className="flex gap-4 mt-2">
              {profileId == username ? (
                <Link
                  to="/settings/edit-profile"
                  className="btn-light rounded-medium"
                >
                  Edit Profile
                </Link>
              ) : (
                ""
              )}
            </div>

            <AboutUser
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
              className="max-md:hidden"
            />
          </div>

          <div className="max-md:mt-12 w-full">
            <InPageNav
              routes={["Blogs Published", "About"]}
              defHidden={["About"]}
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

                <LoadMoreDataButton state={blogs} fetchData={getBlogs} />
              </>
              <AboutUser
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            </InPageNav>
          </div>
        </section>
      ) : (
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default UserProfilePage;
