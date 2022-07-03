import { gql } from "@apollo/client";

const LOGIN = gql`
  mutation Login($user: UserInput) {
    login(user: $user) {
      id
    }
  }
`;
const LOGIN_OTP = gql`
  mutation Login($otp: otpInput) {
    loginOtp(otp: $otp) {
      id
      email
      name
      phoneNumber
      verified
    }
  }
`;
const OTP = gql`
  mutation VerifyOtp($otp: otpInput) {
    verifyOtp(otp: $otp) {
      id
      email
      name
      phoneNumber
      verified
    }
  }
`;
const RESEND_OTP = gql`
  mutation Login($user: resendOtp) {
    resendOtp(user: $user) {
      id
      name
      email
      phoneNumber
      password
      verified
    }
  }
`;
const SIGN_UP = gql`
  mutation SignUp($user: UserInput) {
    signUp(user: $user) {
      id
    }
  }
`;
const UPDATE_USER= gql`
  mutation User($id:ID,$user:UserInput){
    updateUser(id:$id,user:$user){
      id
      email
      name
      phoneNumber
      verified
    }
  }
`
const FORGOT_PASS = gql`
  mutation ForgotPass($user: forgotPass) {
    forgotPass(user: $user) {
      id
    }
  }
`;
const FORGOT_OTP = gql`
  mutation ForgotOtp($otp: otpInput) {
    forgotOtp(otp: $otp) {
      user_id
      otp
      createdAt
      expiresAt
    }
  }
`;
const UPDATE_PASS = gql`
  mutation UpdatePass($user: updatePass) {
    updatePass(user: $user) {
      email
      id
      name
      phoneNumber
      password
    }
  }
`;
const PROFILE = gql`
  mutation Profile($profile: profileInput) {
    Profile(profile: $profile) {
      user_id
      qrCode
      enable
      profiletype
      userDetails {
        user_id
        firstName
        lastName
        workEmail
        workPhone
        organization
        title
        birthday
        url
        note
        photo
      }
      socialData {
        platform
        username
      }
      extraInfo {
        extraInfo
      }
    }
  }
`;
const ENABLE_PROFILE = gql`
  mutation EnableProfile($id: ID) {
    enableProfile(id: $id) {
      enable
    }
  }
`;
const DISABLE_PROFILE = gql`
  mutation DisableProfile($id: ID) {
    disableProfile(id: $id) {
      enable
    }
  }
`;

export {
  LOGIN,
  LOGIN_OTP,
  OTP,
  RESEND_OTP,
  SIGN_UP,
  FORGOT_OTP,
  FORGOT_PASS,
  UPDATE_PASS,
  PROFILE,
  DISABLE_PROFILE,
  ENABLE_PROFILE,
  UPDATE_USER
};
