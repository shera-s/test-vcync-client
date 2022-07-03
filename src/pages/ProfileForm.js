import { Link, useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft, FaTrash } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE , UPDATE_USER} from "../config/gql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import Resizer from "react-image-file-resizer";
import { GET_PROFILE } from "../config/gql/queries";
import Preloader from "../components/Preloader";
import { useTranslation} from "react-i18next";


const ProfileForm = () => {
  const {t}=useTranslation()
  const user_id = localStorage.getItem("id");

  //   const { data, refetch } = useQuery(GET_PROFILE, { variables: { id: user_id }, notifyOnNetworkStatusChange: true, })
  const user = useSelector((state) => Object.values(state.user)[0]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {enable,extraInfo,socialData,userDetails,profiletype} = useSelector((state) => state.Profile);
  const socialMediaAccount = useSelector(state=>state.socialMediaAccount)
  const [file, setFile] = useState();
  const [showError, setShowError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const inputFile = useRef(null);
const extra = (extraInfo && extraInfo[0]?.extraInfo!== '') ? extraInfo : []
  const [inputFields, setInputFields] = useState(extra);

  const [profileType, setProfileType] = useState('Business');

  // const { data } = useQuery(GET_PROFILE, {
  //   variables: { id: user_id },
  // });

  // useEffect(() => {
  //   if (data?.getProfilebyId) {
  //     console.log(data.getProfilebyId)
  //     dispatch({
  //       type: "PROFILE",
  //       payload: data.getProfilebyId,
  //     });
  //   }
  // }, [data]);
  useEffect(() => {
    if(profiletype){
      setProfileType(profiletype)
    }
  }, [])
  
  
  const qrCode = `${window.location.origin}/${user_id}`;

  // console.log(user)
    // console.log(userDetails)
  // var dataFields

  // if(Object.keys(data).length === 1){
  //      dataFields = data.getBPbyId.userDetails[0]
  // }
  const [formDetails, setFormdetails] = useState({
    user_id: user_id,
    firstName: userDetails && userDetails[0].firstName || user?.name || '',
    lastName: userDetails && userDetails[0].lastName || '',
    workEmail: userDetails && userDetails[0].workEmail || user?.email || '',
    workPhone: userDetails && userDetails[0].workPhone || user?.phoneNumber || '',
    organization: userDetails && userDetails[0].organization || '',
    title: userDetails && userDetails[0].title || '',
    photo: userDetails && userDetails[0].photo || '',
    birthday: userDetails && userDetails[0].birthday || '',
    url: userDetails && userDetails[0].url || '',
    note: userDetails && userDetails[0].note || '',
  });
  
  // console.log(formDetails)

  const [Profile, { loading }] = useMutation(PROFILE);
  const [updateUser, {error}] = useMutation(UPDATE_USER);

  // if (loading) return <Preloader />

  // if (loading) return <h1>Loading.....</h1>
  const handleChange = (e) => {
    setFormdetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  const addField = (e) => {
    e.preventDefault();
    setInputFields([...inputFields, { extraInfo: "" }]);
  };

  const removeField = (i) => {
    // e.preventDefault()
    const values = [...inputFields];
    values.splice(i, 1);
    setInputFields(values);
  };

  const inputChange = (e, i) => {
    const values = [...inputFields];
    values[i][e.target.name] = e.target.value;
    setInputFields(values);
  };
  
  const handleSocial = async (e) => {
    
    const profileFields = {
      user_id: user_id,
      userDetails: [formDetails],
      extraInfo: inputFields,
      qrCode:qrCode,
      profiletype:profileType,
      socialData:socialData
    };
    e.preventDefault();
    dispatch({
      type: "PROFILE",
      payload: profileFields,
    });
    navigate("/profile/socialmedia");
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        200,
        200,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        100,
        100
      );
    });

  const getFiles = async (e) => {
    const size = e.target.files[0].size;

    if (size > 2097152) {
      return setImageError(t('File_is_greater_than_2MB'));
    } else {
      setImageError("");
    }

    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      setFile(image);
      setFormdetails((prev) => {
        return { ...prev, ["photo"]: image };
      });
      const profileFields = {
        user_id: user_id,
        userDetails: [formDetails],
        extraInfo: inputFields,
        qrCode:qrCode,
        profiletype:profileType,
        socialData:socialData
      };
      dispatch({
        type: "PROFILE",
        payload:profileFields
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      workPhone,
      workEmail,
      organization,
      title,
      birthday,
      url,
      note,
    } = formDetails;
    try {
      const profileFields = {
        user_id: user_id,
        userDetails: formDetails,
        extraInfo: inputFields!==[] ? inputFields :{ extraInfo: "" },
        qrCode:qrCode,
        profiletype:profileType,
        enable:true,
        socialData:socialMediaAccount!==[] ? socialMediaAccount : {
          platform:'',
          username:''
        }
      };
      const {data} = await Profile({
        variables: { profile: profileFields },
      });
      if(data){

        dispatch({
          type: "PROFILE",
          payload: data.Profile,
        });
      }
      const userFields = {
        name:formDetails.firstName,
        phoneNumber:formDetails.workPhone,
        email:formDetails.workEmail
      }
      const {data:updateuserdata} = await updateUser({
        variables: { id:user_id,user:userFields },
      });
      if(updateuserdata){

        dispatch({
          type: "SETUSER",
          payload: updateuserdata,
        });
      }
      // console.log(data);

        window.location.href = "/";
      // navigate("/", { replace: true })
    } catch (error) {
      return setShowError(error);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-2 rounded shadow-md text-black w-full">
          <Link to="/">
            <button className="w-full hover:text-green-700 ">
              <FaLongArrowAltLeft size={42} />
            </button>
          </Link>
<div
            className="w-full inline-flex rounded-full shadow-sm mb-9"
            role="group"
          >
            <button
              onClick={() => setProfileType("Business")}
              type="button"
              className={`w-full py-3 px-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-l-full border border-gray-200 hover:bg-white hover:text-green-700 ${profileType == 'Business' && 'z-10 bg-white text-green-700'}`}
            >
              {t('Business')}
            </button>
            <button
              onClick={() => setProfileType("Personal")}
              type="button"
              className={`w-full py-3 px-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-r-full border border-gray-200 hover:bg-white hover:text-green-700 ${profileType == 'Personal' && 'z-10 bg-white text-green-700'}`}
            >
              {t('Personal')}
            </button>
          </div>
          <div className="text-center">
            <img
              className="h-32 w-32 inline-block object-cover rounded-full"
              src={file || formDetails.photo || "/user.png"}
              alt="Current profile photo"
            />

            <div className="w-full mt-2 mb-4 text-sky-500 font-medium">
              <button
                type="button"
                className="text-zinc-900"
                onClick={() => inputFile.current.click()}
              >
                {t('Add_Photo')}
              </button>

              <input
                type="file"
                className="hidden"
                ref={inputFile}
                onChange={getFiles}
              />
            </div>
            <p className="mt-2 mb-4 text-red-700 text-center ">{imageError}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="">{t('First_Name')}</label>
            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="firstName"
              value={formDetails.firstName}
              onChange={handleChange}
              required
            />

            <label htmlFor="">{t('Last_Name')}</label>
            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="lastName"
              value={formDetails.lastName}
              onChange={handleChange}
              required
            />

            <label htmlFor="">{t('Work_Email')}</label>
            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="workEmail"
              value={formDetails.workEmail}
              onChange={handleChange}
              required
            />

            <label htmlFor="">{t('Work_Phone')}</label>
            <input
              type="number"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="workPhone"
              value={formDetails.workPhone}
              onChange={handleChange}
              required
            />

            <label htmlFor="">{t('Organization')}</label>
            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="organization"
              value={formDetails.organization}
              onChange={handleChange}
            />

            <label htmlFor="">{t('Title')}</label>
            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="title"
              value={formDetails.title}
              onChange={handleChange}
            />
            <label htmlFor="">{t('Birthday')}</label>
            <input
              type="date"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="birthday"
              value={formDetails.birthday}
              onChange={handleChange}
            />
            <label htmlFor="">{t('Url')}</label>
            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="url"
              value={formDetails.url}
              onChange={handleChange}
            />
            <label htmlFor="">{t('Note')}</label>
            <input
              type="text"
              className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
              name="note"
              value={formDetails.note}
              onChange={handleChange}
            />

{inputFields.map((v, i) => {
              return (
                <div className="relative" key={i}>
                  <input
                    type="text"
                    className="block border border-grey-light bg-slate-100 w-full p-3 rounded mb-4 focus:outline-none"
                    name="extraInfo"
                    value={inputFields[i].extraInfo}
                    onChange={(e) => inputChange(e, i)}
                  />

                  <button
                    type="submit"
                    onClick={() => removeField(i)}
                    className="text-green-700 absolute right-2.5 bottom-2.5  focus:outline-none hover:text-zinc-700 text-sm px-4 py-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}

            <button
              onClick={(e) => addField(e)}
              className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-2"
            >
              {t('Add_an_extra_field')}
            </button>

            <button
              onClick={(e) => handleSocial(e)}
              className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-2"
            >
              {t('Add_social_media_account')}
            </button>

            {loading ? (
              <button
                disabled
                type="submit"
                className="disabled:opacity-75 w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-2"
              >
                {t('Creating....')}
              </button>
            ) : (
              <button
                type="submit"
                className="w-full text-center py-3 rounded-full bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-2"
              >
                {t('Submit_Profile')}
              </button>
            )}

            <p className="mt-2 mb-4 text-red-700 text-center ">{showError}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
