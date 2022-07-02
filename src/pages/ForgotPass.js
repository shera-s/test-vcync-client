import { useState } from "react";
import { useMutation } from "@apollo/client";
import { FORGOT_PASS } from "../config/gql/mutations";
import { useNavigate } from "react-router-dom";
import { useTranslation} from "react-i18next";


const ForgotPassword = () => {
  const {t}=useTranslation()
  let navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    phoneNumber: "",
  });
  const [showError, setShowError] = useState(false);

  // console.log("otp user==>",user);

  const [forgotPass, { data, loading, error }] = useMutation(FORGOT_PASS);

  var handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userdata = await forgotPass({ variables: { user: userInput } });
      if (!userInput.phoneNumber) {
        return setShowError(t('Please_Fill_the_field'));
      }
      if (userdata) {
        localStorage.setItem("id", userdata.data.forgotPass.id);
        navigate("/forgotpassword/verifynumber", { replace: true });
      }
    } catch (error) {
      setShowError(`${error.message}`);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center font-medium">
            {t('Enter_Your_Number')}
          </h1>

          <input
            type="number"
            className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
            name="phoneNumber"
            placeholder="92 xxxx"
            onChange={handleChange}
            value={userInput.phoneNumber}
          />
          {loading ? (
            <button
              disabled
              type="submit"
              className="disabled:opacity-75 w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
            >
             {t('Verifying_User')}
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
          <p className="mb-4 text-red-700 text-center ">{showError}</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
