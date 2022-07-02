import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import UserPrivateRoute from "../components/UserPrivateRoute";
import AddSocial from "../pages/AddSoicalAccount";
import ForgotPassword from "../pages/ForgotPass";
import ForgotVerifyOTP from "../pages/ForgotVerifyOtp";
import Login from "../pages/Login";
import LoginVerifyOTP from "../pages/LoginVerifyOtp";
import Profile from "../pages/Profile";
import Signup from "../pages/Signup";
import SocialMedia from "../pages/SocialMedia";
import UpdatePassword from "../pages/UpdatePass";
import User from "../pages/User";
import VcyncCard from "../pages/Vcync-card";
import VerifyOTP from "../pages/VerifyOtp";
import ProfileForm from "../pages/ProfileForm";

import Navbar from "../components/Navbar";
import { GET_PROFILE } from "../config/gql/queries";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";

const RoutesConfig = () => {
  
  const user_id = localStorage.getItem("id");

  const dispatch = useDispatch()
  
  const { data } = useQuery(GET_PROFILE, {
    variables: { id: user_id },
  });
  useEffect(() => {
    if (data?.getProfilebyId) {
      dispatch({
        type: "PROFILE",
        payload: data.getProfilebyId,
      });
    }
  }, [data]);
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        {/* <Route path='/vcync' element={<VcyncCard />} /> */}
        {/* <Route path='/user' element={<User />} /> */}
        <Route
          index
          element={
            <UserPrivateRoute>
              <User />
            </UserPrivateRoute>
          }
        />
        <Route path="/:id" element={<Profile />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/profile/socialmedia" element={<SocialMedia />} />
        <Route path="/profile/socialmedia/add" element={<AddSocial />} />
        <Route
          path="/signup"
          element={
            <PrivateRoute>
              <Signup />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PrivateRoute>
              <Login />
            </PrivateRoute>
          }
        />
        {/* <Route path='/private' element={<PrivateRoute />} /> */}
        <Route path="/signup/verifyotp" element={<VerifyOTP />} />
        <Route path="/login/verifyuser" element={<LoginVerifyOTP />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route
          path="/forgotpassword/verifynumber"
          element={<ForgotVerifyOTP />}
        />
        <Route
          path="/forgotpassword/verifynumber/updatepassword"
          element={<UpdatePassword />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesConfig;
