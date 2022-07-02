import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "../config/gql/mutations";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);

  const [UserInput, setUserInput] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [checkValue, setCheckValue] = useState(false);
  const [showError, setShowError] = useState(false);
  const { name, email, phoneNumber, password } = UserInput;
  const [signUp, { data, loading, error }] = useMutation(SIGN_UP);

  const ShowPass = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  var handleChange = (e) => {
    setUserInput({ ...UserInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !phoneNumber || !password) {
        return setShowError(t("Please_fill_all_fields"));
      }
      const userdata = await signUp({ variables: { user: UserInput } });
      if (userdata) {
        console.log(userdata.data.signUp.id);
        localStorage.setItem("id", userdata.data.signUp.id);
        navigate("/signup/verifyotp", { replace: true });
      }
    } catch (error) {
      setShowError(`${error.message}`);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <form onSubmit={handleSubmit}>
            <h1 className="mb-8 text-3xl text-center font-medium">
              {t("Signup")}
            </h1>

            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
              name="name"
              placeholder={t("Full_Name")}
              // required
              value={UserInput.name}
              onChange={handleChange}
            />

            <input
              type="email"
              className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
              name="email"
              placeholder={t("Email")}
              value={UserInput.email}
              onChange={handleChange}
            />

            <input
              type="number"
              className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
              name="phoneNumber"
              placeholder="92 xxxxx"
              value={UserInput.phoneNumber}
              onChange={handleChange}
            />

            <div className="relative">
              <input
                type={passwordShown ? "text" : "password"}
                className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
                name="password"
                placeholder={t("Password")}
                value={UserInput.password}
                onChange={handleChange}
              />

              <div className="absolute top-1 right-0">
                {passwordShown ? (
                  <button
                    onClick={ShowPass}
                    className="w-10 text-green-700 hover:text-green-900"
                    style={{'height':'3rem'}}
                  >
                    <FaEyeSlash />
                  </button>
                ) : (
                  <button
                    onClick={ShowPass}
                    className="w-10 text-green-700 hover:text-green-900"
                    style={{ height: "3rem" }}
                  >
                    <FaEye />
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs text-grey-dark mt-4">
              <input
                type="checkbox"
                onChange={(e) => setCheckValue(e.target.checked)}
                className="checked:bg-blue-500 focus:outline-none"
              />
              <span className="w-full  p-2">
                {t(
                  "I_would_like_to_receive_your_newsletter_&_other_promotional_information"
                )}
              </span>
            </div>
            {loading ? (
              <button
                disabled
                type="submit"
                className="disabled:opacity-75 w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
              >
                {t("Creating...")}
              </button>
            ) : (
              <button
                type="submit"
                className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
              >
                {t("Create_Account")}
              </button>
            )}
            <p className="mt-4 mb-4 text-red-700 text-center ">{showError}</p>

            <div className=" text-center text-sm text-green-700 hover:text-green-900 mt-4">
              <Link to="/login">{t("Already_have_an_account?_Login")}</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
