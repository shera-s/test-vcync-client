import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { OTP } from "../config/gql/mutations";
import { useNavigate } from "react-router-dom";
import { useTranslation} from "react-i18next";

const VerifyOTP = () => {
  const {t}=useTranslation()
  const dispatch = useDispatch();

  let navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    otp: "",
  });
  const [showError, setShowError] = useState(false);

  // console.log("otp user==>",user);

  const [verifyOtp, { data, loading, error }] = useMutation(OTP);

  var handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = localStorage.getItem("id");
      // console.log(id)
      const otpData = { user_id: id, ...userInput };
      if (!userInput.otp) {
        return setShowError(t('Please_Fill_the_field'));
      }
      const userdata = await verifyOtp({ variables: { otp: otpData } });
      if (userdata) {
        // console.log(otp)
        dispatch({
          type: "SETUSER",
          payload: userdata.data,
        });
        navigate("/", { replace: true });
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
          {loading ? (
            <button
              disabled
              type="submit"
              className="disabled:opacity-75 w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
            >
              {t('Verifying...')}
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

export default VerifyOTP;
