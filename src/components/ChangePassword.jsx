import React, { useContext, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";

//assets
import AnimationWrapper from "../assets/PageAnimation";

//component
import InputBox from "./InputBox";

//middleware
import axios from "axios";

//context
import { UserContext } from "../App";

const ChangePassword = () => {
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let changePasswordForm = useRef();

  let passwordRegex =
    /^(?=.*\d)(?=.*[-+_!@#$%^&*., ?])(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;

  const handleChangePassword = (e) => {
    e.preventDefault();

    let form = new FormData(changePasswordForm.current);

    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { currentPassword, newPassword } = formData;

    if (!currentPassword.length || !newPassword.length) {
      return toast.error("Enter in all the inputs");
    }

    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      return toast.error(
        "Please enter a valid Password containing 6-20 Character, number, uppercase chars, lowercase chars, a special character"
      );
    }

    e.target.setAttribute("disabled", true);

    let loadingToast = toast.loading("Updating...");

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        return toast.success("Password Updated");
      })
      .catch(({ response }) => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        return toast.error(response.data.error);
      });
  };

  return (
    <AnimationWrapper>
      <Toaster />
      <form ref={changePasswordForm}>
        <h1 className="max-md:hidden">Change Password</h1>

        <div className="py-10 w-full md:max-w-[400px]">
          <InputBox
            name="currentPassword"
            type="password"
            className="profile-edit-input"
            placeholder="Current Password"
            icon="fi-sr-unlock"
          />

          <InputBox
            name="newPassword"
            type="password"
            className="profile-edit-input"
            placeholder="New Password"
            icon="fi-sr-unlock"
          />

          <button
            className="btn-dark px-10"
            type="submit"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePassword;
