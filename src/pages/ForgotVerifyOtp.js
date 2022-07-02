import { useState } from "react";
import { useMutation } from "@apollo/client";
import { FORGOT_OTP } from "../config/gql/mutations";
import { useNavigate } from "react-router-dom";
import { useTranslation} from "react-i18next";

const ForgotVerifyOTP = () => {
  const {t}=useTranslation()
  let navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    otp: "",
  });
  const [showError, setShowError] = useState(false);

  const [forgotOtp, { data, loading, error }] = useMutation(FORGOT_OTP);

  var handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = localStorage.getItem("id");
      const otpData = { user_id: id, ...userInput };
      if (!userInput.otp) {
        return setShowError(t('Please_Fill_the_field'))
      }
      const otp = await forgotOtp({ variables: { otp: otpData } });
      if (otp) {
        navigate("/forgotpassword/verifynumber/updatepassword", {
          replace: true,
        });
      }
    } catch (error) {
      setShowError(`${error.message}`);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center font-medium">{t('Verify_OTP')}</h1>
          <p className="mb-4 text-red-700 text-center ">{showError}</p>

          <input
            type="number"
            className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
            name="otp"
            placeholder="xxxx"
            onChange={handleChange}
            value={userInput.otp}
          />

          {/* <button className='w-full text-left font-medium text-xs hover:text-green-900'>Resend OTP</button> */}
          {loading ? (
            <button
              disabled
              type="submit"
              className="disabled:opacity-75 w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
            >
              {t('Verifying_OTP...')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
            >
              {t('Verify')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotVerifyOTP;
