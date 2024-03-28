import React, { useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useContext } from "react";
import archblogs from "../images/archblogs.png";
import archblogs_dark from "../images/archblogs_dark.png";

//images
import google from "../images/google.png";
import facebookIcon from "../images/facebookIcon.png";

//component
import InputBox from "../components/InputBox.jsx";

//assets
import AnimationWrapper from "../assets/PageAnimation.jsx";
import { storeInSession } from "../assets/Sessions.jsx";
import { authWithGoogle } from "../assets/Firebase.jsx";
import { authWithFacebook } from "../assets/Firebase.jsx";

//middleware
import axios from "axios";

//context
import { ThemeContext, UserContext } from "../App.jsx";

const UserAuthForm = ({ type }) => {
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  let { theme, setTheme } = useContext(ThemeContext);
  const authThroughServer = (routeServer, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + routeServer, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let routeServer = type == "sign-in" ? "/signin" : "/signup";
    // regex for email
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // regex for password
    let passwordRegex =
      /^(?=.*\d)(?=.*[-+_!@#$%^&*., ?])(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;

    //form data
    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;
    //Validation of form

    if (fullname) {
      if (fullname.length < 2) {
        return toast.error("Your Fullname must be at least 2 letters long");
      }
    }

    if (!email.length) {
      return toast.error("Please enter your Email address");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid Email address");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Please enter a valid Password containing 6-20 Character, number, uppercase chars, lowercase chars, a special character"
      );
    }

    authThroughServer(routeServer, formData);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();
    authWithGoogle()
      .then((user) => {
        let routeServer = "/google-auth";

        let formData = {
          access_token: user.accessToken,
        };

        authThroughServer(routeServer, formData);
      })
      .catch((err) => {
        return toast.error("Error occured while login through Google");
      });
  };

  const handleFacebookAuth = (e) => {
    e.preventDefault();
    authWithFacebook()
      .then((user) => {
        let routeServer = "/facebook-auth";

        let formData = {
          access_token: user.accessToken,
        };

        authThroughServer(routeServer, formData);
      })
      .catch((err) => {
        return toast.error("Error occured while login through Facebook");
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="formElement" className="w-[80%] max-w-[400px]">
          {theme == "light" ? (
            <img src={archblogs} className="-mt-24" alt="archblogs_logo" />
          ) : (
            <img src={archblogs_dark} alt="archblogs_logo" />
          )}

          {type !== "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-sr-user"
            />
          ) : (
            ""
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email Address"
            icon="fi-sr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-sr-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p className="text-xl">or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center  w-[80%] gap-4 center mb-4"
            onClick={handleGoogleAuth}
          >
            <img src={google} className="w-7" />
            Continue with Google
          </button>

          <button
            className="btn-dark flex items-center justify-center  w-[80%] gap-4 center mb-4"
            onClick={handleFacebookAuth}
          >
            <img src={facebookIcon} className="w-5 -mr-2.5 md:mr-0" />
            Continue with Facebook
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-2">
                Sign-Up today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link to="/signin" className="underline text-black text-xl ml-2">
                Sign in here
              </Link>
            </p>
          )}
          <p className="text-center m-6 bg-grey rounded-full font-normal">
            Designed by{" "}
            <a
              href="https://www.chahatgakhar.com/"
              target="_blank"
              className="underline"
            >
              Chahat Gakhar
            </a>
          </p>
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
