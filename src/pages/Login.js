import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../config/gql/mutations";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation} from "react-i18next";

const Login = () => {
  const {t}=useTranslation()
  let navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [showError, setShowError] = useState(false);
  const [userInput, setUserInput] = useState({
    phoneNumber: "",
    password: "",
  });
  const [login, { data, loading, error }] = useMutation(LOGIN);

  // if (loading) return <h1>loading....</h1>

  const ShowPass = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  var handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(userInput);
    if (!userInput.phoneNumber || !userInput.password) {
      return setShowError("Please fill all Fields ");
    }
    try {
      // console.log("Login with :", userInput);
      const userdata = await login({ variables: { user: userInput } });
      // console.log("After Request: ", userdata);
      if (userdata) {
        localStorage.setItem("id", userdata.data.login.id);
        navigate("/login/verifyuser", { replace: true });
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
            <h1 className="mb-8 text-3xl text-center font-medium">{t('Login')}</h1>
            <input
              type="number"
              className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
              name="phoneNumber"
              placeholder="+98 xxxxxxxxxx"
              onChange={handleChange}
              value={userInput.phoneNumber}
              required
            />
            <div className="relative">
              <input
                type={passwordShown ? "text" : "password"}
                className="block border border-grey-light w-full p-3 rounded mb-4 focus:outline-none"
                name="password"
                placeholder={t('Password')}
                onChange={handleChange}
                value={userInput.password}
                required
              />
              <div className="absolute top-1 right-1">
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
                    style={{'height':'3rem'}}
                  >

                    <FaEye/>
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <button
                disabled
                className="disabled:opacity-75 w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
              >
                {t('Finding...')}
              </button>
            ) : (
              <button
                type="submit"
                className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
              >
                {t('Login')}
              </button>
            )}
            <p className="mt-4 mb-4 text-red-700 text-center ">{showError}</p>

            {/* // } */}

            <div className=" text-center text-sm text-green-700 hover:text-green-900 mt-4">
              <Link to="/forgotpassword">{t('Forgot_your_password')}</Link>
            </div>
            <div className=" text-center text-sm text-green-700 hover:text-green-900 mt-4">
              <Link to="/signup">{t('Dont_have_an_account?_Signup')}</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
