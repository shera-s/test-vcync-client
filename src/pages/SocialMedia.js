import { FaMinus, FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { GET_PROFILE } from "../config/gql/queries"
// import { useQuery} from '@apollo/client';
// import Preloader from "../components/Preloader";
import { useTranslation} from "react-i18next";


const SocialMedia = () => {
  const {t}=useTranslation()
  const user_id = localStorage.getItem("id");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socialAccount = useSelector((state) => state.socialMediaAccount);

  // const { data,loading, refetch } = useQuery(GET_PROFILE, { variables: { id: user_id }, notifyOnNetworkStatusChange: true, })

  // if(loading) return <Preloader />

  // console.log(data)

  const deleteAccount = (indx) => {
    // console.log(indx);
    dispatch({
      type: "DELETESOCIAL",
      payload: indx,
    });
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <button
            onClick={() => navigate("/profile")}
            className="w-full hover:text-green-700 "
          >
            <FaLongArrowAltLeft size={42} />
          </button>
          <h1 className="mb-8 text-3xl text-center font-medium">
            {t('Social_Media')}
          </h1>

          {socialAccount.map((v, i) => {
            // console.log(v);
            return (
              <div className="relative" key={i}>
                <div className="block bg-zinc-800 text-white w-full px-6 py-3 rounded-full mb-4 focus:outline-none">
                  {v.platform} {"->"} @{v.username}
                </div>
                <div className="absolute top-1 right-1">
                  <button
                    onClick={() => deleteAccount(i)}
                    className="h-10 w-10 text-white hover:text-red-700"
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => navigate("/profile/socialmedia/add")}
            className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-2"
          >
            {t('+_Add_An_account')}
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-2"
          >
            {t('Done')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
