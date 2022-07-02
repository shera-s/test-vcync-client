import QRCode from "react-qr-code";
import { GET_PROFILE, DOWN_VCF } from "../config/gql/queries";
import { useQuery } from "@apollo/client";
import Preloader from "../components/Preloader";
import { useEffect } from "react";
import { useTranslation} from "react-i18next";
var FileSaver = require('file-saver');


const Profile = () => {
  const {t}=useTranslation()
  const getId = window.location.pathname;
  const user_Id = getId.substring(1);
  const { loading, error, data } = useQuery(GET_PROFILE, {
    variables: { id: user_Id },
  });
  const {data:downdata}= useQuery(DOWN_VCF,{
    variables:{id:user_Id}
  })
  const downloadFile = (data) => {
    var blob = new Blob([data.file], {type: "text/x-vCard;charset=iso-8859-1"});
    FileSaver.saveAs(blob, `${data.firstName}.vcf`);
  }
  
  useEffect(() => {
    if(downdata && data?.getProfilebyId?.enable){
        
        downloadFile(downdata.generatevcffile)
      
    }
  }, [downdata ])
  
  if (loading) return <Preloader />;
  if (error) console.log(error);
  const { userDetails, qrCode, enable } = data?.getProfilebyId
  

  return (
    <>
      {/* <Navbar /> */}
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-md mx-auto flex-1 flex flex-col justify-center px-2">
          <div className="bg-zinc-900  px-6 py-8 rounded shadow-md w-full">
            <div className="py-3 border-white border-b-2">
              <p className=" text-white font-medium">{t('VCYNC_Card_APP')}</p>
            </div>

            {enable === true ? (
              <>
                <div className="pt-6 grid grid-cols-2 gap-4 ">
                  <p className="text-white font-medium">
                    {t('Name')}
                    <br />
                    <span className="text-2xl text-white font-medium">
                      {userDetails[0].firstName} {userDetails[0].lastName}
                    </span>
                  </p>
                  <div className="text-right">
                    <img
                      className="h-32 w-32 inline-block text-right object-cover rounded"
                      src={userDetails[0].photo || "/user.png"}
                      alt="user"
                    />
                  </div>
                </div>

                <p className="text-white font-medium">
                  {t('Phone')}
                  <br />
                  <span className="text-2xl text-white font-medium">
                    {userDetails[0].workPhone}
                  </span>
                </p>

                <div className="mt-6 flex justify-center">
                  <div className="pt-3 px-3 bg-white text-center rounded">
                    <QRCode
                      className="border-white text-zinc-900text-center inline-block"
                      value={qrCode}
                    />
                    <br />
                    <p className="font-medium">www.vcync.com</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-3 text-center border-white border-b-2">
                <p className="py-20 text-2xl text-white font-medium">
                {t('Profile_is_currently_disabled')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
