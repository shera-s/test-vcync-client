import {
  FaCopy,
  FaEdit,
  FaEye,
  FaHammer,
  FaPowerOff,
  FaQrcode,
  FaWallet,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "react-qr-code";
import { DISABLE_PROFILE, ENABLE_PROFILE } from "../config/gql/mutations";
import { GET_PROFILE, DOWN_PKPASS } from "../config/gql/queries";
import { useMutation, useQuery } from "@apollo/client";
import Preloader from "../components/Preloader";
import { useEffect, useState } from "react";
import { useTranslation} from "react-i18next";
import FileSaver from 'file-saver';
// import Buffer from 'buffer';
window.Buffer = window.Buffer || require("buffer").Buffer; 

const User = () => {
  const {t}=useTranslation()
  const Profile = useSelector((state) => state.Profile);
  const dispatch = useDispatch();
  const user = useSelector((state) => Object.values(state.user)[0]);
  const navigate = useNavigate();
  const [showError, setShowError] = useState();
  const [enable, setEnable] = useState('Enable_Profile');
  const [disable, setDisable] = useState('Disable_Profile');
  const [copyLink, setCopyLink] = useState('Copy_profile_link');

  const id = localStorage.getItem("id");
  const [disableProfile, { error }] = useMutation(DISABLE_PROFILE);
  const [enableProfile] = useMutation(ENABLE_PROFILE);
  const {data,loading,refetch} = useQuery(GET_PROFILE, {
    variables: { id: id },
    notifyOnNetworkStatusChange: true,
  });
  const {data:downdata} = useQuery(DOWN_PKPASS, {
    variables: { id: id },
  });

  useEffect(() => {
    if(data?.getProfilebyId){
      dispatch({
        type: "PROFILE",
        payload: data.getProfilebyId,
      });
  }
}, [data])

  if (loading) return <Preloader />;

  //   console.log(enableProfile);
  // console.log(window.location);

  const disableProfiles = async () => {
    setDisable(t('Disabling....'));
    try {
      const profile = await disableProfile({
        variables: { id: data.getProfilebyId.user_id },
      });
      if (profile) {
        refetch({ id: id });
        setDisable(t('Disable_Profile'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const enableProfiles = async () => {
    setEnable(t('Enabling....'));
    try {
      const profile = await enableProfile({
        variables: { id: data.getProfilebyId.user_id },
      });
      if (profile) {
        refetch({ id: id });
        setEnable(t('Enable_Profile'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveQrCode = () => {
    const svg = document.getElementById("QRCode");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const downloadFile = (data) => {
    fetch( data.file, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
    },
  })
  .then((response) => response.blob())
  .then((blob) => {
    const url = window.URL.createObjectURL(
      new Blob([blob]),
    );
    const downloadLink = document.createElement("a");
    downloadLink.download = data.firstName+'.pkpass';
    downloadLink.href = url;
    downloadLink.click();
  });
  }
  
  const addtowallet= async(e)=>{
    console.log('Feature on the way...')
    console.log(downdata)
    if(downdata){
      downloadFile(downdata.generatepkpass)
    }
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch({
      type: "SIGNOUT",
    });
    localStorage.clear()
    // window.location.reload();
  };

  return (
    <>

      <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center">
        <div className="bg-white px-1 py-8 rounded shadow-md text-black w-full">
          <h3 className="mb-1 text-2xl text-center font-bold">
            {t('Hi')} {user?.name}
          </h3>
          <h3 className="mb-5 text-2xl text-center font-bold">
            {t('Welcome_to_Vcync')}
          </h3>

          {Object.keys(data)?.length < 1 ||
          Object.keys(Profile)?.length === 0 ? (
            <Link to="/profile">
              <button
                type="submit"
                className="w-full py-3 my-1 mt-4 rounded-full bg-zinc-800 text-white hover:bg-green-900 focus:outline-none ">
                <FaHammer className="w-12 inline" />
                {t('Build_your_profile')}
              </button>
            </Link>
          ) : (
            <Link to="/profile">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-zinc-800 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
              >
                <FaEdit className="w-12 inline" />
                {t('Edit_your_profile')}
              </button>
            </Link>
          )}

          <div
            className="w-full inline-flex rounded-full shadow-sm my-9"
            role="group"
          >
            <button
              type="button"
              className={`w-full py-3 px-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-l-full border border-gray-200 hover:bg-white hover:text-green-700 ${data?.getProfilebyId?.profiletype == 'Business' && 'z-10 bg-white text-green-700'}`}>
              {t('Business')}
            </button>
            <button
              type="button"
              className={`w-full py-3 px-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-r-full border border-gray-200 hover:bg-white hover:text-green-700 ${data?.getProfilebyId?.profiletype == 'Personal' && 'z-10 bg-white text-green-700'}`}
            >
              {t('Personal')}
            </button>
          </div>

          <p className="mt-4 mb-4 text-red-700 text-center ">{t(showError)}</p>

          <div className="grid grid-cols-2 gap-2 ">
            {Object.keys(data)?.length < 1 ||
            Object.keys(Profile)?.length === 0 ? (
              <>
                <button
                  onClick={() => setShowError("To View Profile Build It first")}
                  className=" py-3 px-2  rounded-xl inline-flex items-center  bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
                >
                  <FaEye className="w-8 inline" />
                  <span className="w-full text-center">{t('View_profile')}</span>
                </button>
                <button
                  onClick={() =>
                    setShowError(t('To_Copy_Profile_Link_Build_It_first'))
                  }
                  className="py-3 px-2  rounded-xl inline-flex items-center  bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
                >
                  <FaCopy className="w-8 inline" />
                  <span className="w-full text-center">{t('Copy_profile_link')}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/${data?.getProfilebyId?.user_id}`)}
                  type="submit"
                  className="py-3 px-2  rounded-xl inline-flex items-center  bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
                >
                  <FaEye className="w-8 inline" />
                  <span className="w-full text-center">{t('View_profile')}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(data?.getProfilebyId?.qrCode);
                    setCopyLink(t('Link_Copied'));
                    setTimeout(() => setCopyLink('Copy_profile_link'),500);
                  }}
                  type="button"
                  className="py-3 px-2  rounded-xl inline-flex items-center  bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
                >
                  <FaCopy className="w-8 inline" />
                  <span className="w-full text-center">{t(copyLink)}</span>
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.keys(data)?.length < 1 ||
            Object.keys(Profile)?.length === 0 ? (
              <>
                <button
                  onClick={() =>
                    setShowError(t('To_Save_Qr_Code_Build_Profile_first'))
                  }
                  className=" py-3 px-2  rounded-xl inline-flex items-center  bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
                >
                  <FaQrcode className="w-8 inline" />
                  <span className="w-full text-center">{t('Save_QR_code')}</span>
                </button>
                <button
                  onClick={() => setShowError(t('To_Enable_Build_Profile_first'))}
                  className="py-3 px-2  rounded-xl inline-flex items-center  bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
                >
                  <FaPowerOff className="w-8 inline" />
                  <span className="w-full text-center">{t('Enable_Profile')}</span>
                </button>
              </>
            ) : data.getProfilebyId?.enable && data.getProfilebyId.enable === true ? (
              <>
                <button
                  onClick={saveQrCode}
                  className="py-3 px-2  rounded-xl inline-flex items-center  bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
                >
                  <FaQrcode className="w-8 inline" />
                  <span className="w-full text-center">{t('Save_QR_code')}</span>
                </button>
                <button
                  onClick={disableProfiles}
                  className="py-3 px-2  rounded-xl inline-flex items-center  bg-zinc-900 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
                >
                  <FaPowerOff className="w-8 inline" />
                  <span className="w-full text-center">{t(disable)}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={saveQrCode}
                  className="py-3 px-2  rounded-xl inline-flex items-center  bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
                >
                  <FaQrcode className="w-8 inline" />
                  <span className="w-full text-center">{t('Save_QR_code')}</span>
                </button>
                <button
                  onClick={enableProfiles}
                  className="py-3 px-2  rounded-xl inline-flex items-center  bg-green-700 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
                >
                  <FaPowerOff className="w-8 inline" />
                  <span className="w-full text-center">{t(enable)}</span>
                </button>
              </>
            )}
            {Object.keys(data).length < 1 ||
            Object.keys(Profile).length === 0 ? (
              ""
            ) : (
              <QRCode
                id="QRCode"
                className="hidden"
                value={data?.getProfilebyId?.qrCode || "Hello world"}
              />
            )}
          </div>

          <div className="border-t-4 rounded-full border-zinc-500 my-9"></div>

          <div className="text-center mb-7">
          {Object.keys(data)?.length < 1 ||
            Object.keys(Profile)?.length === 0 ? (
              <>
            <button
            onClick={()=>setShowError(t('To_Add_To_Wallet_Build_Profile_first'))}
              type="submit"
              className=" py-3 px-4 rounded-xl inline-flex items-center bg-zinc-800 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
            >
              <FaWallet className="w-12 inline" />
              {t('Add_To_Apple_Wallet')}
            </button>
            </>) : <>
            <button
            onClick={()=>addtowallet()}
              type="submit"
              className=" py-3 px-4 rounded-xl inline-flex items-center bg-zinc-800 text-white hover:bg-green-900 focus:outline-none my-1 mt-4"
            >
              <FaWallet className="w-12 inline" />
              {t('Add_To_Apple_Wallet')}
            </button>
            </>}
          </div>

          <div className="text-center">
            <button
              onClick={logout}
              type="submit"
              className="px-2 text-xl font-medium text-zinc-900 hover:text-green-900 focus:outline-none my-1 mt-4"
            >
              {t('Logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>

  );
};

export default User;
