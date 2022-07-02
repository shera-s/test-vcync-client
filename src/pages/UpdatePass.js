import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { UPDATE_PASS } from "../config/gql/mutations";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation} from "react-i18next";


const UpdatePassword = () => {
  const {t}=useTranslation()
  const dispatch = useDispatch();

  let navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    password: "",
  });
  const [showError, setShowError] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const ShowPass = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  // console.log("otp user==>",user);

  const [updatePass, { data, loading, error }] = useMutation(UPDATE_PASS);

  var handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = localStorage.getItem("id");
      const newPass = { user_id: id, ...userInput };
      if (!userInput.password) {
        return setShowError(t('Please_Fill_the_field'));
      }
      const update = await updatePass({ variables: { user: newPass } });
      if (update) {
        // console.log(update);
        dispatch({
          type: "SETUSER",
          payload: update.data,
        });
        navigate("/login", { replace: true });
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
            {t('New_Password')}
          </h1>
          <p className="mb-4 text-red-700 text-center ">{showError}</p>

          <div className="relative">
            <input
              type={passwordShown ? "text" : "password"}
              className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
              name="password"
              placeholder={t('Password')}
              required
              onChange={handleChange}
              value={userInput.password}
            />
            <div className="absolute top-1 right-1">
              {passwordShown ? (
                <button
                  onClick={ShowPass}
                  className="h-10 w-10 text-green-700 hover:text-green-900"
                >
                  <FaEyeSlash />
                </button>
              ) : (
                <button
                  onClick={ShowPass}
                  className="h-10 w-10 text-green-700 hover:text-green-900"
                >
                  <FaEye />
                </button>
              )}
            </div>
          </div>

          {/* <button className='w-full text-left font-medium text-xs hover:text-green-900'>Resend OTP</button> */}

          {loading ? (
            <button
              disabled
              type="submit"
              className="disabled:opacity-75 w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
            >
              {t('Updating_Password...')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
            >
              {t('Update_Password')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
