import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useTranslation} from "react-i18next";


const AddSocial = () => {
  const {t}=useTranslation()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [socialmedia, setSocialMedia] = useState({
    platform: "",
    username: "",
  });

  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    setSocialMedia({ ...socialmedia, [e.target.name]: e.target.value });
  };
  // console.log(socialmedia);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!socialmedia.platform || !socialmedia.username) {
      return setShowError(t('Please_fill_all_fields'));
    } else {
      dispatch({
        type: "ADDSOCIAL",
        payload: socialmedia,
      });
      navigate("/profile/socialmedia");
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center font-medium">
            {t('Social_Media')}
          </h1>

          <form onSubmit={handleSubmit}>
            <select
              id="countries"
              name="platform"
              onChange={handleChange}
              value={socialmedia.platform}
              className="block border  mb-4 border-grey-light bg-slate-100 text-gray-900 rounded-lg  focus:outline-none w-full p-3"
            >
              <option defaultValue>{t('Please_select_the_platform')}</option>
              <option value="Instagram">{t('Instagram')}</option>
              <option value="LinkedIn">{t('LinkedIn')}</option>
              <option value="Twitter">{t('Twitter')}</option>
              <option value="Tiktok">{t('Tiktok')}</option>
            </select>

            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="username"
              placeholder={t('Username')}
              onChange={handleChange}
              value={socialmedia.username}
              // required
            />

            <button
              type="submit"
              className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
            >
              {t('Confirm')}
            </button>

            <p className="mt-4 mb-4 text-red-700 text-center ">{showError}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSocial;
